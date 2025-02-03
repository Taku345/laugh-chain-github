<?php

namespace Blu\Http\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Console\GeneratorCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;
use Illuminate\Support\Str;

class Make extends GeneratorCommand
{
    protected $name = 'blu:make';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $config_path = config_path().'/'.str_replace('.', '/', $this->argument('config'));
        if (file_exists($config_path) && is_dir($config_path))
        {
            foreach (glob($config_path.'/*') as $config_file)
            {
                $child_config_name = $this->argument('config').'.'.pathinfo($config_file, PATHINFO_FILENAME).'.config';
                // var_dump($child_config_name);
                // call;
                // viewName
                // softDelete
            }

            return;
        }

        if (!config($this->argument('config')))
        {
            $this->components->error('Invalid config file');
            return false;
        }

        $name = $this->getNameInput();

        $softDelete = $this->argument('softDelete') ?: false;
        if ($softDelete == 'no') $softDelete = false;

        $this->call('blu:model', array_filter([
            'config' => $this->argument('config'),
            'name' => $name,
            'softDelete' => $softDelete,
            '--force' => $this->option('force'),
        ]));

        $controller = Str::studly($name);

        $this->call('blu:controller', array_filter([
            'config' => $this->argument('config'),
            'name' => "{$controller}Controller",
            'softDelete' => $softDelete,
            '--model' => $this->getNameInput(),
            '--requests' => true,
            '--force' => $this->option('force'),
        ]));

        $this->call('blu:routing', array_filter([
            'config' => $this->argument('config'),
            'name' => $name,
            'viewName' => $this->argument('viewName') ?: $name,
            'softDelete' => $softDelete,
        ]));

        $table = Str::snake(Str::pluralStudly(class_basename($name)));

        $this->call('blu:migration', [
            'config' => $this->argument('config'),
            'name' => "create_{$table}_table",
            'softDelete' => $softDelete,
            '--create' => $table,
            '--fullpath' => true,
        ]);


        $this->call('blu:typescript', [
            'config' => $this->argument('config'),
            'dir' => $name,
            'softDelete' => $softDelete,
            'viewName' => $this->argument('viewName') ?: $name,
            '--force' => $this->option('force'),
        ]);

    }

    protected function getStub() {}

    protected function getNameInput()
    {
        return $this->option('name') ?: implode('/', array_map(function ($s) { return \Str::studly($s); }, explode('.', preg_replace(['/\.config$/i', '/^[^\.]+\./'], ['', ''], $this->argument('config')))));
    }

    protected function getArguments()
    {
        return [
            ['config', InputArgument::REQUIRED, 'The config name ?'],
            ['viewName', InputArgument::REQUIRED, 'is view name ?'],
            ['softDelete', InputArgument::REQUIRED, 'is SoftDelete ? '],
        ];
    }


    protected function getOptions()
    {
        return [
            ['name', null, InputOption::VALUE_REQUIRED, 'The name'],
            ['force', null, InputOption::VALUE_NONE, 'Create the class even if the model already exists'],
        ];
    }

    protected function promptForMissingArgumentsUsing()
    {
        return [
            // 'name' => 'What should be named? (0 is generate from config name)',
            'viewName' => 'What should be viewName?',
            'softDelete' => 'What should the be softDelete? (1 or 0)....',
        ];
    }
}


