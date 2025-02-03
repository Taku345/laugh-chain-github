<?php

namespace Blu\Http\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class MakeAll extends Command
{
    protected $name = 'blu:make-all';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $config_dir_path = config_path().'/'.str_replace('.', '/', $this->argument('config'));
        if (file_exists($config_dir_path) && is_dir($config_dir_path))
        {
            $softDeletes = $this->option('softDeletes') ? explode(',', $this->option('softDeletes')) : [];
            $names = $this->option('names') ? explode(',', $this->option('names')) : [];

            var_dump($softDeletes);
            foreach (glob($config_dir_path.'/*') as $i => $config_file)
            {
                $config_name = $this->argument('config').'.'.pathinfo($config_file, PATHINFO_FILENAME).'.config';

                $softDelete = \Arr::get($softDeletes, $i, null);
                $name = \Arr::get($names, $i, null);

                if ($softDelete == "0") $softDelete = 'no';

                $this->components->info('make:'.$config_name);
                $this->call('blu:make', array_filter([
                    'config' => $config_name,
                    'viewName' => $name,
                    'softDelete' => $softDelete,
                    '--force' => $this->option('force'),
                ]));

                // hasMany も作る
                foreach (config($config_name) as $fieldName => $field)
                {
                    if (\Arr::get($field, 'type', null) == 'hasMany')
                    {
                        sleep(1);
                        // TODO: softDelete
                        $this->components->info('make:'.$config_name.'.'.$fieldName.'.'.'hasMany');
                        $child_name = \Str::beforeLast(implode('/', array_map(function ($s) { return \Str::studly($s); }, explode('.', preg_replace(['/\.config$/i', '/^[^\.]+\./'], ['', ''], $config_name)))), '/').'/'.\Str::studly($fieldName);
                        $this->call('blu:model', array_filter([
                            'config' => $config_name.'.'.$fieldName.'.'.'hasMany.config',
                            'name' => $child_name,
                            '--migration' => true,
                        ]));

                        $table = \Str::snake(\Str::pluralStudly(class_basename($child_name)));

                        $this->call('blu:migration', [
                            'config' => $config_name.'.'.$fieldName.'.'.'hasMany.config',
                            'name' => "create_{$table}_table",
                            '--create' => $table,
                            '--fullpath' => true,
                        ]);

                        $this->call('blu:request', array_filter([
                            'config' => $config_name.'.'.$fieldName.'.'.'hasMany.config',
                            'name' => \Str::beforeLast(implode('/', array_map(function ($s) { return \Str::studly($s); }, explode('.', preg_replace(['/\.config$/i', '/^[^\.]+\./'], ['', ''], $config_name)))), '/').'/'.\Str::studly($fieldName),
                        ]));
                    }
                }
                sleep(1);
            }

        }
        else
        {
            $this->components->error('Invalid config dir');
            return;
        }

        $this->call('blu:layout');
    }

    protected function getArguments()
    {
        return [
            ['config', InputArgument::REQUIRED, 'The config dir?'],
        ];
    }

    protected function getOptions()
    {
        return [
            ['force', null, InputOption::VALUE_NONE, 'Create the class even if the model already exists'],
            ['names', null, InputOption::VALUE_REQUIRED, 'Create the class even if the model already exists'],
            ['softDeletes', null, InputOption::VALUE_REQUIRED, 'Create the class even if the model already exists'],
        ];
    }
}


