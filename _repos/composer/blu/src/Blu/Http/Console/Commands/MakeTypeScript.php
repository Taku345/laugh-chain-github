<?php

namespace Blu\Http\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Contracts\Console\PromptsForMissingInput;
use Illuminate\Support\Str;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Finder\Finder;

class MakeTypeScript extends Command implements PromptsForMissingInput
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */

    protected $files;

    protected $name = 'blu:typescript';

    protected $type = 'TypeScript';
    
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    protected static $stubs = [
        '/stubs/ts/constants.stub',
        '/stubs/ts/Index.stub',
        '/stubs/ts/Trash.stub',
        '/stubs/ts/Show.stub',
        '/stubs/ts/Create.stub',
        '/stubs/ts/Edit.stub',
        '/stubs/ts/Form/customCallbacks.stub',
        '/stubs/ts/Form/customFields.stub',
        '/stubs/ts/View/customCallbacks.stub',
        '/stubs/ts/View/customFields.stub',
    ];


    public function __construct(Filesystem $files)
    {
        parent::__construct();

        if (in_array(CreatesMatchingTest::class, class_uses_recursive($this))) {
            $this->addTestOptions();
        }

        $this->files = $files;
    }


    /**
     * Execute the console command.
     */
    public function handle()
    {
        foreach (static::$stubs as $stubName)
        {
            $dir = $this->argument('dir');

            $path = $this->getPath($dir, $stubName);

            // Next, We will check to see if the class already exists. If it does, we don't want
            // to create the class and overwrite the user's code. So, we will bail out so the
            // code is untouched. Otherwise, we will continue generating this class' files.
            if ((! $this->hasOption('force') ||
                 ! $this->option('force')) &&
                 $this->alreadyExists($dir, $stubName)) {
                $this->components->error($path.' already exists.');
    
                continue;
            }

            $this->makeDirectory($path);

            $this->files->put($path, $this->buildClass($stubName));
            $this->components->info(sprintf('%s [%s] created successfully.', $stubName, $path));
        }

    }

    protected function makeDirectory($path)
    {
        if (! $this->files->isDirectory(dirname($path))) {
            $this->files->makeDirectory(dirname($path), 0777, true, true);
        }

        return $path;
    }


    protected function alreadyExists($dir, $stubName)
    {
        return $this->files->exists($this->getPath($dir, $stubName));
    }

    protected function getPath($dir, $stubName)
    {
        $ext = $stubName == 'constants.stub' ? '.ts': '.tsx';
        return  resource_path('ts/Pages/'.$dir.str_replace(['/stubs/ts', '.stub'], ['', $ext], $stubName));
    }

    protected function buildClass($stubName)
    {
        $stub = $this->files->get($this->getStub($stubName));

        $stub = str_replace([
            '{{ viewName }}',
            '{{ routePrefix }}',
            '{{ softDelete }}',
        ], [
            $this->argument('viewName') ?: $this->argument('config'),
            preg_replace(['/\.config$/i', '/^[^\.]+\./'], ['', ''], $this->argument('config')),
            $this->argument('softDelete') ? 'true': 'false',
        ], $stub);

        return $stub;
    }


    protected function getArguments()
    {
        return [
            ['config', InputArgument::REQUIRED, 'The config of the '.strtolower($this->type)],
            ['dir', InputArgument::REQUIRED, 'The dir of the '.strtolower($this->type)],
            ['viewName', InputArgument::REQUIRED, 'The viewName of the '.strtolower($this->type)],
            ['softDelete', InputArgument::REQUIRED, 'is SoftDelte of the '.strtolower($this->type)],
        ];
    }

    protected function getOptions()
    {
        $options = parent::getOptions();
        $options[] = ['--force', null, InputOption::VALUE_NONE, 'is force?'];
        return $options;
    }

    protected function promptForMissingArgumentsUsing()
    {
        return [
            'config' => 'What should the '.strtolower($this->type).' be config?',
            'dir' => 'What should the '.strtolower($this->type).' be dir?',
        ];
    }

    protected function getStub($stubName)
    {
        return $this->resolveStubPath($stubName);
    }

    protected function resolveStubPath($stub)
    {
        return file_exists($customPath = $this->laravel->basePath(trim($stub, '/')))
                        ? $customPath
                        : __DIR__.$stub;
    }
}


