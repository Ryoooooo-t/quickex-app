# 製品仕様書（PRD）：フリマ物販特化型「売れる商品説明文ジェネレーター」

## 1. 概要
- **製品名**: QuickEx（フリマ即売アシスト）
- **ターゲット**: メルカリ、ラクマ、ヤフオク等で副業・物販を行う出品者
- **目的**: 出品作業（説明文・タイトル・タグ作成）にかかる時間を10分から1分に短縮し、売れる構成の出品文を自動生成する。
- **インフラ方針**: 初期費用・固定費0円（Next.js + Tailwind CSS + Google Gemini API無料枠 + Stripe Checkout）

---

## 2. 技術スタック
- **Framework**: Next.js (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Icons**: lucide-react
- **AI SDK**: Google Gen AI SDK (`@google/genai` または `@google/generative-ai`)
- **API Model**: `gemini-2.5-flash` または `gemini-1.5-flash`
- **State / Storage**: LocalStorage（無料利用回数・課金状態の判定）
- **Payments**: Stripe Checkout（API連携）

---

## 3. 主要機能要件

### (1) 入力フォーム機能（1画面完結型）
ユーザーは以下の項目を入力して生成を実行する：
1. **商品名・型番・ブランド名**（必須：テキスト入力）
2. **カテゴリ**（必須：セレクトボックス：レディース、メンズ、家電・スマホ、ホビー・おもちゃ、本・音楽・ゲーム、コスメ・美容、その他）
3. **商品の状態**（必須：ラジオボタン：新品・未使用、未使用に近い、目立った傷や汚れなし、やや傷や汚れあり、全体的に状態が悪い）
4. **補足情報・アピール点**（任意：テキストエリア：サイズ、カラー、購入時期、使用頻度、付属品、即購入可、24時間以内発送など）
5. **文章のトーン**（必須：トグル：【丁寧・安心型】/【スピード即売型】/【シンプル要点型】）

### (2) AI生成ロジック（バックエンドAPI: `/api/generate`）
Gemini APIへ以下のシステム指示を与えて構造化された結果を生成する：
- **タイトル案（30〜40字以内）を3パターン**（検索キーワード、ブランド名、型番、状態を前方に配置）
- **出品本文**（以下のセクションを整然と配置）：
  - 【おすすめポイント】
  - 【商品詳細・スペック】
  - 【状態・留意事項】（クレーム防止のための誠実な記載テンプレート）
  - 【発送・梱包について】
- **ハッシュタグ（8〜12個）**（メルカリ内検索でヒットしやすいタグ）
- ※規約違反となるNGワード（ノークレーム・ノーリターン等）は出力禁止。

### (3) 生成結果プレビュー＆コピー機能
- タイトル案：クリックでその場でコピー可能。
- 本文：ワンクリックでクリップボードに全文コピーできるボタンを配置。
- ハッシュタグ：タグ単体コピーまたは本文末尾への自動挿入。

### (4) 無料枠制限（Rate Limiting）
- LocalStorageキー: `quickex_usage_count` (数値), `quickex_reset_date` (YYYY-MM-DD)
- 1日**3回まで**完全無料で生成可能。
- 日付変更（0:00）で自動リセット。
- 残り回数はヘッダーにバッジ表示（例: `本日残り: 2/3回`）。

### (5) Stripe決済連携＆PRO機能解放
- 無料枠（3回）を使い切った状態で「生成ボタン」を押すと、アップグレード案内モーダルを表示。
- プラン構成：買い切り980円 または 月額500円。
- Stripe Checkoutへのリダイレクトエンドポイント（`/api/checkout`）を実装。
- 決済完了リダイレクト先（`/success?session_id=...`）にて、LocalStorageに `is_pro_user: true` を付与し、回数制限を無制限に解除。

---

## 4. UI/UX 要件
- レスポンシブ対応（PC・スマホ両対応、特にスマホからの操作性を重視）。
- 清潔感のあるモダンなデザイン（Slate/Blue基調）。
- 生成中はスケルトンUIまたはローディングスピナーを表示し、処理中であることを明示。
- コピー完了時は「コピーしました！」とトースト通知を表示。

---

## 5. 推奨ファイル構成
```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                # メインの1画面ダッシュボード
│   ├── success/
│   │   └── page.tsx            # Stripe決済成功画面
│   └── api/
│       ├── generate/
│       │   └── route.ts        # Gemini API連携
│       └── checkout/
│           └── route.ts        # Stripe Checkout Session作成
├── components/
│   ├── Header.tsx              # ロゴ・残り回数バッジ・PROボタン
│   ├── GeneratorForm.tsx       # 入力フォーム
│   ├── ResultPreview.tsx       # タイトル・本文・ハッシュタグ表示
│   └── ProModal.tsx            # 有料プラン誘導モーダル
└── lib/
    ├── gemini.ts               # Gemini SDKクライアント
    └── stripe.ts               # Stripeクライアント

## 6. 実装フェーズ（Roadmap）
- **Phase 1**: Next.js + Tailwind CSS 環境の初期化とUIコンポーネント実装
- **Phase 2**: LocalStorageによる1日3回の回数制限ロジックと状態管理の実装
- **Phase 3**: Gemini APIを用いた `/api/generate` の実装とプロンプト調整
- **Phase 4**: クリップボードコピーやトースト通知等のUX改善
- **Phase 5**: Stripe Checkout決済フローとPROステータス更新の実装
- **Phase 6**: 本番デプロイ（Vercel または Firebase Hosting）、環境変数設定、本番決済・動作検証
