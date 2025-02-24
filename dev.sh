#!/bin/bash

# 以下を一括で実行できるようにしました
# ./vendor/bin/sail up -d
# ./vendor/bin/sail npm run dev
# ./vendor/bin/sail artisan queue:work
# ./vendor/bin/sail artisan schedule:work
# ./vendor/bin/sail artisan reverb:start

# 使い方
# chmod +x dev.shで実行権限を付与
# ./dev.shで実行

# Function to start a process in a new terminal window
start_process() {
    osascript -e "tell application \"Terminal\"
        do script \"cd $(pwd) && $1\"
    end tell"
}

# Function to check if Laravel Sail containers are ready
wait_for_sail() {
    echo "Starting Laravel Sail containers..."
    ./vendor/bin/sail up -d

    echo "Waiting for containers to be ready..."
    while ! ./vendor/bin/sail artisan --version > /dev/null 2>&1; do
        echo "Waiting for Laravel to be ready..."
        sleep 2
    done
    echo "Laravel is ready!"
}

# Start Sail and wait for it to be ready
wait_for_sail

# Start each process in a new terminal window
start_process "./vendor/bin/sail npm run dev"
start_process "./vendor/bin/sail artisan queue:work"
start_process "./vendor/bin/sail artisan schedule:work"
start_process "./vendor/bin/sail artisan reverb:start"
