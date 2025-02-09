<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Election;
use App\Services\OpenAiService;

class AiApiController extends Controller
{
    protected $openAiService;

    // OpenAiServiceを依存注入
    public function __construct(OpenAiService $openAiService)
    {
        $this->openAiService = $openAiService;
    }

    // テーマ生成
    public function generate_theme()
    {
        return $this->openAiService->generate_theme();
    }
    public function generate_themes()
    {
        return $this->openAiService->generate_themes();
    }

    // 一言目生成
    public function generate_opening_line(Request $request)
    {
        $theme = $request->input('theme');

        if (!$theme) abort(404);

        return $this->openAiService->generate_opening_line($theme);
    }
    public function generate_opening_lines(Request $request)
    {
        $theme = $request->input('theme');

        \Log::info('theme: '.$theme);

        return $this->openAiService->generate_opening_lines($theme);
    }

    // 繋ぎ生成
    public function generate_scene()
    {
        return $this->openAiService->generate_scene();
    }

    // 選択肢生成
    public function generate_choices()
    {
        return $this->openAiService->generate_choices();
    }
}
