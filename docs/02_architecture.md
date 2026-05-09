# RENXIN アーキテクチャ

## 1. 現行構成（ローカルファースト）
- UIプロセス（React）: 画面描画と入力受付。
- Coreプロセス（Rust）: ゲームロジック、DB、録画、観戦配信。
- 観戦クライアント（Browser）: LAN経由で更新イベントを受信。

## 2. 境界契約
### IPC（UI ↔ Core）
- 同期的なコマンド/レスポンス。
- ビジネスルールはCoreのみが保持。

### RPC/WebSocket（Core → 観戦）
- 非同期のPublish/Subscribe。
- 最低イベント: ゲーム状態更新、ラウンド終了、接続状態。

## 3. 将来のサーバー分離
契約（IPC/RPC）を先に固定し、将来は以下へ分離可能にする。
- クライアント側: UI + ローカルキャッシュ。
- サーバー側: 認証、集計、同期、長期保存。


## 4. IPCコマンド一覧（初期）
- `start_game(game_type, players)`
- `record_throw(game_id, player_id, segment)`
- `undo_throw(game_id)`
- `finish_round(game_id)`
- `start_practice(menu_type)`
- `finish_practice(session_id)`
- `get_recommended_menus(context_stats)`

## 5. RPCイベント一覧（初期）
- `game_state_updated`
- `round_finished`
- `practice_state_updated`
- `watch_connection_state`

## 6. エラー分類
- `VALIDATION_ERROR`
- `DB_ERROR`
- `CAMERA_ERROR`
- `STORAGE_LIMIT_ERROR`
- `NETWORK_ERROR`


## 7. プロトコル/互換性方針
- IPC/RPCメッセージに `schema_version` を付与する。
- 破壊的変更はメジャーバージョン更新でのみ実施する。
- 観戦クライアント再接続時は `latest_snapshot` を再取得後に差分購読する。

## 8. セキュリティ/公開範囲
- 観戦RPCはLAN内利用を前提とし、既定では localhost バインドを優先する。
- LAN公開を有効化する場合は設定画面で明示的に切り替える。
- ログ/診断出力に個人情報を含めない。
