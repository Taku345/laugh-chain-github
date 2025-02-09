<?php

namespace App\Services;

use GuzzleHttp\Client;

class openAiService
{
    protected $client;

    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    public function generate_intro()
    {
        return $this->sendOpenAi(config('laugh_chain.openAi.prompt.generate.intro'));
    }

    public function generate_theme()
    {
        return $this->sendOpenAi(config('laugh_chain.openAi.prompt.generate.theme'));
    }

    public function generate_themes()
    {
        return $this->sendOpenAi(config('laugh_chain.openAi.prompt.generate.themes'));
    }

    public function generate_opening_line($theme)
    {
        $messageToAi = config('laugh_chain.openAi.prompt.generate.opening_line') . $theme;
        return $this->sendOpenAi($messageToAi);
    }

    public function generate_opening_lines($theme)
    {
        $messageToAi = config('laugh_chain.openAi.prompt.generate.opening_lines') . $theme;
        return $this->sendOpenAi($messageToAi);
    }

    public function generate_scene()
    {
        // テストデータ
        $sampleData = array(
            "theme" => "リモートワーク",
            "history" => "お前、リモートワークって知ってるか？",
        );
        $jsonData = json_encode($sampleData);

        $messageToAi = config('laugh_chain.openAi.prompt.generate.scene') . $jsonData;
        return $this->sendOpenAi($messageToAi);
    }

    public function generate_choices()
    {
        // テストデータ
        $sampleData = array(
            "theme" => "リモートワーク",
            "history" => "お前、リモートワークって知ってるか？",
        );
        $jsonData = json_encode($sampleData);

        $messageToAi = config('laugh_chain.openAi.prompt.generate.choices') . $jsonData;
        return $this->sendOpenAi($messageToAi);
    }
    

    private function sendOpenAi($messageToAi)
    {
        $history = [];

        // OpenAI APIリクエストの準備
        $client = new Client();
        $response = $client->post('https://api.openai.com/v1/chat/completions', [
            'headers' => [
                'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'model' => config('laugh_chain.openAi.model'),
                'messages' => array_merge($history, [
                    ['role' => 'user', 'content' => $messageToAi],
                ]),
            ],
        ]);

        $data = json_decode($response->getBody(), true);
        $botReply = $data['choices'][0]['message']['content'];

        return $botReply;
        
    }

    private function jsonToArray($jsonString)
    {
        // JSONをデコード（連想配列として取得）
        $data = json_decode($jsonString, true);

        // JSONのエラーチェック
        if (json_last_error() !== JSON_ERROR_NONE) {
            die("JSONの解析に失敗しました: " . json_last_error_msg());
        }

        return $data;
    }

    private function parseJsonIntro($jsonString)
    {
        // JSONをデコード（連想配列として取得）
        $data = json_decode($jsonString, true);

        // JSONのエラーチェック
        if (json_last_error() !== JSON_ERROR_NONE) {
            die("JSONの解析に失敗しました: " . json_last_error_msg());
        }

        // 各テーマと一言目を表示
        foreach ($data as $item) {
            echo "テーマ: " . $item["テーマ"] . "\n";
            echo "一言目一覧:\n";
            foreach ($item["一言目"] as $sentence) {
                echo "- " . $sentence . "\n";
            }
            echo "\n"; // 改行
        }
    }

    private function parseJsonTheme($jsonString)
    {
        // JSONをデコード（連想配列として取得）
        $data = json_decode($jsonString, true);

        // JSONのエラーチェック
        if (json_last_error() !== JSON_ERROR_NONE) {
            die("JSONの解析に失敗しました: " . json_last_error_msg());
        }

        // テーマを表示
        if (isset($data['テーマ'])) {
            // テーマが配列でない場合はそのまま表示
            if (is_array($data['テーマ'])) {
                foreach ($data['テーマ'] as $theme) {
                    echo "- " . $theme . "\n";
                }
            } else {
                // 単一の値の場合、そのまま表示
                echo "- " . $data['テーマ'] . "\n";
            }
        } else {
            echo "テーマが存在しません。\n";
        }
    }

    private function parseJsonThemes($jsonString)
    {
        // JSONをデコード（連想配列として取得）
        $data = json_decode($jsonString, true);

        // JSONのエラーチェック
        if (json_last_error() !== JSON_ERROR_NONE) {
            die("JSONの解析に失敗しました: " . json_last_error_msg());
        }

        // テーマを表示
        if (isset($data['テーマ']) && is_array($data['テーマ'])) {
            foreach ($data['テーマ'] as $theme) {
                echo "- " . $theme . "\n";
            }
        } else {
            echo "テーマが存在しません。\n";
        }
    }
}