# RENXIN データ契約

## 1. 主要テーブル
- players
- games
- game_participants
- rounds
- throws
- zero_one_round_states
- cricket_marks
- cricket_scores

## 2. レーティング契約
- 基準: DARTSLIVE公式準拠。
- モード:
  - `official_80`
  - `reference_100`
  - `dual`（両保存、表示は `official_80` 優先）

## 3. 動画ライフサイクル
- 保持期間: 90日（既定）。
- 容量上限: 80GB（動画ディレクトリ合計）。
- 削除順: 古い動画から。
- 保護動画: 自動削除対象外。
- 容量超過かつ保護動画のみの場合: 録画停止 + UIへ明示エラー。

## 4. エラーレスポンス共通形式
```json
{
  "code": "ERROR_CODE",
  "message": "human readable",
  "details": {}
}
```


## 5. 練習メニュー推奨ルール（初期）
- ダブル成功率が閾値未満の場合: Bob's 27 を最優先提案。
- Checkout成功率が閾値未満の場合: 121 Checkout を最優先提案。
- セグメント散らばりが大きい場合: Around the Clock を最優先提案。
- 複数条件該当時: 優先度は Double > Checkout > Segment。
- 推奨根拠は結果画面に表示し、手動選択で上書き可能とする。


## 6. レーティング計算詳細（実装前に固定）
- 更新タイミング: ゲーム終了時に確定値を保存。
- 丸め規則: DARTSLIVE公開仕様に合わせ、差異が出る場合はテーブル定義を優先。
- 表示優先: `official_80` を主表示、`reference_100` は参考表示。
- 保存方針: `dual` 時は両方保存し、履歴比較可能とする。


## 7. DTO（初期）
### 7.1 ThrowRecord
- `game_id: string`
- `player_id: string`
- `round_number: number`
- `throw_number: number`
- `segment: string`
- `scored_point: number`
- `timestamp: string(ISO-8601)`

### 7.2 PracticeSession
- `session_id: string`
- `menu_type: "around_the_clock" | "bobs_27" | "checkout_121"`
- `started_at: string(ISO-8601)`
- `ended_at: string | null`
- `achievement_score: number`
- `notes: string | null`

### 7.3 RecommendationReason
- `menu_type: string`
- `reason_code: string`
- `source_metric: string`
- `metric_value: number`

## 8. データ整合性ルール
- `throws` は `rounds` と `game_participants` の外部キー整合を必須とする。
- PracticeSession終了時に `ended_at` を必須入力とする。
- 練習メニュー推奨の根拠データは、計算時点の統計スナップショットを保存する。


## 9. 推奨閾値（初期値）
- `double_hit_rate < 0.25` → Bob's 27
- `checkout_success_rate < 0.20` → 121 Checkout
- `segment_dispersion_index > 0.35` → Around the Clock

## 10. 統計スナップショット項目（推奨根拠保存用）
- `sample_games`
- `double_hit_rate`
- `checkout_success_rate`
- `segment_dispersion_index`
- `recorded_at`
