
# Install

## .env ファイル
```
# copy env file
cp .env.example .env
```

## コンテナを立ち上げて諸々インストール
**※Docker 必須です**  
ここからは sail を使う前提なので alias を書いておくと便利です。
これで以下の .vender/bin/sail → sail で動きますので。
```
alias sail='[ -f sail ] && bash sail || bash vendor/bin/sail'
```


```
# docker inisialization
docker run --rm -v $(pwd):/opt -w /opt laravelsail/php84-composer:latest bash -c "composer install"

# run server
./vendor/bin/sail up -d
(※ちなみにコンテナの停止は　./vendor/bin/sail down)

# Laravel key generate and write to .env
./vendor/bin/sail artisan key:generate

# create databases
./vendor/bin/sail artisan migrate

# install node modules
./vendor/bin/sail npm install
```

* * *
ここまでで、**./vendor/bin/sail npm run dev** だけ実行して、http://localhost を見て何か出てればインストールは成功です。
* * *

## 各種コマンド (任意で流してください)
```
# 管理者を生成 private_key を指定すると、その鍵で管理ユーザーを作ってくれます
./vendor/bin/sail artisan app:create-admin {private_key?} {email?} {name?}

# デモデータを作成、非公開で作成されるので、勝手に投票プロセスが流れることはないです
./vendor/bin/sail artisan dev:create-demo-data

```


# コンテナで開発時

以下を実行してください。リアルタイムで投票を進めたり、ユーザーに状態を通知→同期させるのに必要です。
```
# TypeScript や Sass の watch -> build
./vendor/bin/sail npm run dev
```

```
# job の queue -> Broadcast に使います。 
./vendor/bin/sail artisan queue:work
```

```
# schedule の実行 -> 立候補や投票のプロセスの管理や、予約された選挙の開始に使います。
./vendor/bin/sail artisan schedule:work
```

## WebSocket
Laravel Reverb を使うか pusher を使うかで変わってきます。
.env の下の方に書いてありますので、適宜切り替えて使ってください
(※ ID 〜 SECRET まで設定を書いておかないと動かないので、適当な設定を書いてあります)
```
# reverb を起動
./vendor/bin/sail artisan reverb:start
```



