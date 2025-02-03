<?php

namespace Blu\Http\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Routing\Console\ControllerMakeCommand;
use Illuminate\Console\GeneratorCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class MakeController extends ControllerMakeCommand
{
    protected $name = 'blu:controller';

    protected function buildClass($name)
    {
        $stub = parent::buildClass($name);

        $viewDir = preg_replace('/Controller$/i', '/', \Str::studly($this->argument('name')));
        $routePrefix = preg_replace(['/\.config$/i', '/^[^\.]+\./'], ['.', ''], $this->argument('config'));
        $configPrefix = preg_replace('/\.config$/i', '.', $this->argument('config'));

        $stub = str_replace('{{ viewDir }}', $viewDir, $stub);
        $stub = str_replace('{{ routePrefix }}', $routePrefix, $stub);
        $stub = str_replace('{{ configPrefix }}', $configPrefix, $stub);

        $configReplace = "";
        foreach (config($this->argument('config')) as $fieldName => $field)
        {
            switch ($type = \Arr::get($field, 'type', null))
            {
            case 'belongsTo':
            case 'belongsToMany':
                if (is_array(\Arr::get($field, 'options', null)))
                {
                    $configReplace .= "// \$config['".$fieldName."']['options'] += ".\Str::studly($fieldName)."::query()->get()->pluck(null, 'id')->toArray();\n";
                }
                if (is_array(\Arr::get($field, 'search.'.$fieldName.'.options', null)))
                {
                    $configReplace .= "// \$config['".$fieldName."']['search']['".$fieldName."']['options'] = ".\Str::studly($fieldName)."::query()->get()->pluck('/* TODO: */', 'id')->toArray();\n";
                }
                if (is_array(\Arr::get($field, 'search.'.$fieldName.'_id.options', null)))
                {
                    $configReplace .= "// \$config['".$fieldName."']['search']['".$fieldName."_id']['options'] = ".\Str::studly($fieldName)."::query()->get()->pluck('/* TODO: */', 'id')->toArray();\n";
                }
                break;
            }
        }
        $stub = str_replace('{{ config }}', $configReplace, $stub);

        return $stub;
    }

    protected function getStub()
    {
        $stub = null;

        if ($this->argument('softDelete'))
        {
            $stub ??= '/stubs/controller.softDelete.stub';
        }

        $stub ??= '/stubs/controller.stub';

        return $this->resolveStubPath($stub);
    }

    protected function getArguments()
    {
        return [
            ['config', InputArgument::REQUIRED, 'The config of the '.strtolower($this->type)],
            ['name', InputArgument::REQUIRED, 'The name of the '.strtolower($this->type)],
            ['softDelete', InputArgument::OPTIONAL, 'is SoftDelete of the '.strtolower($this->type)],
        ];
    }

    protected function generateFormRequests($modelClass, $storeRequestClass, $updateRequestClass)
    {
        $requestClass = preg_replace(['/Controller$/i', '/\//'], ['', '\\'], \Str::studly($this->argument('name'))).'Request';

        $this->call('blu:request', [
            'config' => $this->argument('config'),
            'name' => $requestClass,
            '--force' => $this->options('force'),
        ]);

        return [$requestClass, $requestClass];
    }

    protected function resolveStubPath($stub)
    {
        return file_exists($customPath = $this->laravel->basePath(trim($stub, '/')))
                        ? $customPath
                        : __DIR__.$stub;
    }

    protected function buildFormRequestReplacements(array $replace, $modelClass)
    {
        [$namespace, $storeRequestClass, $updateRequestClass] = [
            'Illuminate\\Http', 'Request', 'Request',
        ];

        if ($this->option('requests')) {
            $namespace = 'App\\Http\\Requests';

            [$storeRequestClass, $updateRequestClass] = $this->generateFormRequests(
                $modelClass, $storeRequestClass, $updateRequestClass
            );
        }

        $namespacedRequests = $namespace.'\\'.$storeRequestClass.'';

        if ($storeRequestClass !== $updateRequestClass) {
            $namespacedRequests .= PHP_EOL.'use '.$namespace.'\\'.$updateRequestClass.';';
        }

        return array_merge($replace, [
            '{{ storeRequest }}' => $storeRequestClass,
            '{{storeRequest}}' => $storeRequestClass,
            '{{ updateRequest }}' => $updateRequestClass,
            '{{updateRequest}}' => $updateRequestClass,
            '{{ namespacedStoreRequest }}' => $namespace.'\\'.$storeRequestClass,
            '{{namespacedStoreRequest}}' => $namespace.'\\'.$storeRequestClass,
            '{{ namespacedUpdateRequest }}' => $namespace.'\\'.$updateRequestClass,
            '{{namespacedUpdateRequest}}' => $namespace.'\\'.$updateRequestClass,
            '{{ namespacedRequests }}' => $namespacedRequests,
            '{{namespacedRequests}}' => $namespacedRequests,
        ]);
    }
}