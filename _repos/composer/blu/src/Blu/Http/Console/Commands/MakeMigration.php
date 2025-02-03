<?php

namespace Blu\Http\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Database\Console\Migrations\MigrateMakeCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;
use Illuminate\Support\Composer;
use \Blu\Http\Console\Misc\MigrationCreator;
use Illuminate\Database\Migrations\MigrationCreator as ParentMigrationCreator;

class MakeMigration extends MigrateMakeCommand
{
    protected $signature = 'blu:migration {config : The config of the migration} {name : The name of the migration} {softDelete?}
        {--create= : The table to be created}
        {--table= : The table to migrate}
        {--path= : The location where the migration file should be created}
        {--realpath : Indicate any provided migration file paths are pre-resolved absolute paths}
        {--fullpath : Output the full path of the migration (Deprecated)}';

    public function __construct(Composer $composer)
    {
        $app = app();
        $creator = new MigrationCreator($app['files'], $app->basePath('stubs'));
        parent::__construct($creator, $composer);
    }

    public function handle()
    {
        $config = config($this->argument('config'));
        $this->creator->setConfig($config);
        $this->creator->setSoftDelete($this->argument('softDelete'));
        parent::handle();
    }
}