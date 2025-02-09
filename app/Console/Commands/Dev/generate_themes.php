<?php

namespace App\Console\Commands\Dev;

use Illuminate\Console\Command;
use App\Services\OpenAiService;

class generate_themes extends Command
{
    protected $signature = 'generate_themes';
    protected $description = 'AIでテーマを複数生成する';

    protected $openAiService;

    // OpenAiServiceを依存注入
    public function __construct(OpenAiService $openAiService)
    {
        parent::__construct();
        $this->openAiService = $openAiService;
    }

    public function handle()
    {
        $result = $this->openAiService->generate_themes();
        $this->info($result);
        
    }
}
