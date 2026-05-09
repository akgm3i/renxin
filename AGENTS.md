# RENXIN Codex運用ガイド

## 参照優先順位（上ほど優先）
1. `docs/01_product_requirements.md`
2. `docs/02_architecture.md`
3. `docs/03_data_contracts.md`
4. `docs/04_uiux.md`
5. `docs/05_operations.md`

矛盾がある場合は上位ドキュメントを正とし、下位ドキュメントを修正する。

## 運用方針
- 本リポジトリは **Codex専用** とする。
- 要件は `docs/`、実装進行は Issue/PR で管理する。
- 作業ログはコミットログで担保する（ドキュメント内に時系列ログを残さない）。
- 廃止済み仕様は残さず削除する。

## 実装方針（TDD）
- Red → Green → Refactor を小さく回す。
- テストを先に書き、最小実装で通し、重複を除去する。
