# データ・API仕様詳細

## 1. はじめに

本ドキュメントは「ダーツ練習支援アプリケーション仕様書」を補完し、データベースの構造、および通信アーキテクチャに関する詳細な仕様を定義するものである。

本アーキテクチャは、クライアントPC内部の通信を**プロセス間通信（IPC）で、他PCとのリアルタイム通信をリモートプロシージャコール（RPC）**で実装することを前提とする。これにより、パフォーマンスと保守性の両立を図る。

## 2. データベース設計（スキーマ）

アプリケーションで使用する主要なデータ構造を以下に定義する。

### 2.1. players テーブル
プレイヤー情報を管理する。
| カラム名 | データ型 | 説明 |
| :--- | :--- | :--- |
| id | UUID (PostgreSQL: UUID型, SQLite: TEXT型) | 主キー |
| name | VARCHAR(50) | プレイヤー名 |
| created_at | TIMESTAMP | 登録日時 |

### 2.2. games テーブル
1回のゲームセッションの基本情報を管理する。
| カラム名 | データ型 | 説明 |
| :--- | :--- | :--- |
| id | UUID (PostgreSQL: UUID型, SQLite: TEXT型) | 主キー |
| game_type | VARCHAR(10) | ゲーム種別 (501, cricketなど) |
| status | VARCHAR(10) | ゲーム状態 (in_progress, completed) |
| started_at | TIMESTAMP | ゲーム開始日時 |
| ended_at | TIMESTAMP | ゲーム終了日時 |

### 2.3. game_participants テーブル
どのゲームにどのプレイヤーが参加したかを管理する中間テーブル。
| カラム名 | データ型 | 説明 |
| :--- | :--- | :--- |
| id | UUID (PostgreSQL: UUID型, SQLite: TEXT型) | 主キー |
| game_id | UUID | gamesテーブルへの外部キー |
| player_id | UUID | playersテーブルへの外部キー |
| turn_order | INTEGER | 投擲順 (1, 2, 3...) |

### 2.4. rounds テーブル
ゲーム内の各ラウンドを管理する。
| カラム名 | データ型 | 説明 |
| :--- | :--- | :--- |
| id | UUID (PostgreSQL: UUID型, SQLite: TEXT型) | 主キー |
| game_id | UUID | gamesテーブルへの外部キー |
| round_number | INTEGER | ラウンド番号 (1, 2, 3...) |

### 2.5. throws テーブル
一投ごとの物理的な投擲結果と、それに対応する動画を記録する。
| カラム名 | データ型 | 説明 |
| :--- | :--- | :--- |
| id | UUID (PostgreSQL: UUID型, SQLite: TEXT型) | 主キー |
| round_id | UUID | roundsテーブルへの外部キー |
| participant_id | UUID | game_participantsテーブルへの外部キー |
| throw_number | INTEGER | ラウンド内の投数 (1-3) |
| segment | VARCHAR(10) | 着弾セグメント (例: S_BULL, D_BULL, S1-S20, D1-D20, T1-T20)。取りうる値は厳密に定義された列挙型として扱う。 |
| posture_video_path | VARCHAR(255) | 姿勢カメラ動画のファイルパス |
| board_video_path | VARCHAR(255) | ボードカメラ動画のファイルパス |

### 2.6. zero_one_round_states テーブル
01ゲームにおける各ラウンド終了時の状態を記録する。
| カラム名 | データ型 | 説明 |
| :--- | :--- | :--- |
| id | UUID | 主キー |
| round_id | UUID | roundsテーブルへの外部キー |
| participant_id | UUID | game_participantsテーブルへの外部キー |
| score_remaining | INTEGER | 当該ラウンド終了時の残り点数 |

### 2.7. cricket_marks テーブル
Cricketゲームにおける各ラウンドでのプレイヤーのマーク数を記録する。これにより、特定のナンバー（20, 19, ..., BULL）のマーク数を柔軟に管理できる。
| カラム名 | データ型 | 説明 |
| :--- | :--- | :--- |
| id | UUID (PostgreSQL: UUID型, SQLite: TEXT型) | 主キー |
| round_id | UUID (PostgreSQL: UUID型, SQLite: TEXT型) | roundsテーブルへの外部キー |
| participant_id | UUID (PostgreSQL: UUID型, SQLite: TEXT型) | game_participantsテーブルへの外部キー |
| target_number | VARCHAR(5) | マーク対象のナンバー (例: '20', '19', 'BULL') |
| marks | INTEGER | 当該ナンバーのマーク数 (0-3) |
| created_at | TIMESTAMP | 記録日時 |

### 2.8. cricket_scores テーブル
Cricketゲームにおける各ラウンド終了時のスコアを記録する。
| カラム名 | データ型 | 説明 |
| :--- | :--- | :--- |
| id | UUID (PostgreSQL: UUID型, SQLite: TEXT型) | 主キー |
| round_id | UUID (PostgreSQL: UUID型, SQLite: TEXT型) | roundsテーブルへの外部キー |
| participant_id | UUID (PostgreSQL: UUID型, SQLite: TEXT型) | game_participantsテーブルへの外部キー |
| score | INTEGER | 当該ラウンド終了時の総加点 |

## 3. プロセス間通信 (IPC) 仕様
クライアントアプリケーション内部（UIプロセス ⇔ バックエンドプロセス）の通信を定義する。これらはネットワークを介さず、Tauriの内部APIなどを通じて直接関数を呼び出すイメージとなる。

- create_game(game_type, player_ids)
    - 説明: 新しいゲームを開始する。
    - 引数: ゲーム種別、プレイヤーIDの配列
    - 戻り値: 作成されたゲーム情報と参加者情報
- record_throw(game_id, round_number, ...)
    - 説明: 投擲結果と動画パスを記録する。
    - 引数: ゲームID、ラウンド番号、参加者ID、投数、セグメント、動画パスなど
    - 戻り値: 更新後のゲーム全体の状態
- get_player_stats(player_id, period)
    - 説明: 指定したプレイヤーの統計情報を取得する。
    - 引数: プレイヤーID、集計期間
    - 戻り値: 統計データ

## 4. リモートプロシージャコール (RPC) 仕様
他PCとのリアルタイム通信を定義する。クライアントのバックエンドプロセスがRPCサーバーに接続し、必要に応じてプロシージャを呼び出す。

- rpc.notifyGameStateUpdate(game_id, game_state)
    - 説明: ゲームの状態が更新されたことを、接続している全ての閲覧用クライアントに通知する。
    - 引数: ゲームID、ゲームの最新状態オブジェクト
- rpc.notifyPlaybackStart(game_id, throw_id, ...)
    - 説明: 動画再生が開始されたことを、全ての閲覧用クライアントに通知する。
    - 引数: ゲームID、投擲ID、各種動画URL

## 5. エラーレスポンス仕様

IPCおよびRPC呼び出しにおいてエラーが発生した場合、以下の共通レスポンス形式を採用する。これにより、クライアント側でのエラーハンドリングの一貫性を保つ。

- **共通エラーレスポンス形式**:
    ```json
    {
      "code": "ERROR_CODE",
      "message": "エラーメッセージの詳細",
      "details": {
        // オプション: エラーに関する追加情報
      }
    }
    ```
    - `code`: エラーの種類を示す一意のコード (例: `INVALID_INPUT`, `DATABASE_ERROR`, `CAMERA_NOT_FOUND`)
    - `message`: ユーザーまたは開発者向けの簡潔なエラー説明
    - `details`: エラーのデバッグに役立つ追加情報（例: 無効なフィールド名、スタックトレースの一部）

## 6. データ管理方針
### 6.1. 動画ファイル管理
- 命名規則: 録画された動画ファイルは、サーバー上で /{game_id}/{round_number}/{participant_id}-{throw_number}-{camera_type}.mp4 のように、一意に識別できるパスに保存する。
- DBへの保存: データベースには動画ファイルそのものではなく、上記ファイルパスを保存する。
- データ削除: 将来的に、古い動画データを自動的に削除する仕組みを検討する。（例: 90日以上経過したデータは削除）
