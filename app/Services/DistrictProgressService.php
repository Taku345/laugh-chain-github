<?php

namespace App\Services;

use app\Models\Election;
use App\Models\District;
use App\Models\Candidate;
use App\Services\Symbol\NFTService;
use SymbolSdk\Symbol\Models\PublicKey;

class DistrictProgressService
{
    public static function exec_progress($current)
    {
        $current_progress = config('laugh_chain.district.progress.'.$current);
        $next_progress_key = array_keys(config('laugh_chain.district.progress'))[array_search($current, array_keys(config('laugh_chain.district.progress'))) + 1];

        $next_progress = config('laugh_chain.district.progress.'.$next_progress_key);
        $sec = 0;
        foreach (config('laugh_chain.district.sec') as $key => $s)
        {
            $sec += $s;
            if ($key == $current) break;
        }


        // \Log::info('current process: '. $current);
        $districts = District::public()
            ->where('progress', '<=', $current_progress)
            ->where('created_at', '<=', date('Y-m-d H:i:s', strtotime('-'.$sec.' second')))
            ->get();


        foreach ($districts as $district)
        {
            \Log::info('Exec process: '. $current.' -> '.$next_progress_key.': '.$district->id);
            \Log::info(array_search($current, array_keys(config('laugh_chain.district.progress'))));
            \Log::info(array_keys(config('laugh_chain.district.progress')));
            // 最後の district じゃない場合は、close にするだけ(デモデータに対応)
            if ($district->id != District::where('election_id', $district->election_id)->orderBy('created_at', 'DESC')->first()->id)
            {
                $district->progress = config('laugh_chain.district.progress.close');
                $district->save();
                continue;
            }

            switch ($current)
            {
            case 'ran': // -> voting
                // 立候補が1つもなければ終了する
                if ($district->candidate->count() < 1)
                {
                    // 終了処理
                    static::close_election($district);
                    break;
                }
                \Log::info('ran switch: '.$next_progress);

                $district->progress = $next_progress;
                $district->save();
                event(new \App\Events\ElectionProgressEvent($district->election, config('laugh_chain.district.message.'.$current)));

                break;
            case 'voted': // -> close
                // 終了条件の判定

                // 立候補なし (別('ran')でも判定する)
                if ($district->candidate->count() < 1)
                {
                    static::close_election($district);
                    break;
                }

                // 最多得票数が終了のキーワードに一致
                if ($district->winner_candidate->name == config('laugh_chain.close_keyward'))
                {
                    static::close_election($district, $append_keyward = false);
                    break;
                }

                // election に設定されている district limit を超える
                if (
                    ($district->election->district_limit &&
                    $district->election->district->count() >= $district->election->district_limit) ||
                    $district->election->district->count() >= config('laugh_chain.district_limit')
                )
                {
                    static::close_election($district);
                    break;
                }

                // 選挙が終了していなければ、次の district を作成
                GenerateService::newDistrict($district->election);
                event(new \App\Events\ElectionProgressEvent($district->election, config('laugh_chain.district.message.'.$current)));

                break;
            default:
                $district->progress = $next_progress;
                $district->save();

                event(new \App\Events\ElectionProgressEvent($district->election, config('laugh_chain.district.message.'.$current)));
                break;
            }
        }
    }

    public static function close_election($district, $append_keyward = true)
    {
        $district->progress = config('laugh_chain.district.progress.close');
        $district->save();

        if ($append_keyward)
        {
            $new_district = District::create([
                'election_id' => $district->election->id,
                'progress' => config('laugh_chain.district.progress.close'),
            ]);
            Candidate::create([
                'district_id' => $new_district->id,
                'name' => config('laugh_chain.close_keyward'),
            ]);
        }

        foreach (config('laugh_chain.close_sequesne') as $msg)
        {
            $new_district = District::create([
                'election_id' => $district->election->id,
                'progress' => config('laugh_chain.district.progress.close'),
            ]);
            Candidate::create([
                'district_id' => $new_district->id,
                'name' => $msg,
            ]);
        }
        \Log::info('nft test 1');

        if ($district->id == District::where('election_id', $district->election_id)->orderBy('created_at', 'DESC')->first()->id)
        {
            event(new \App\Events\ElectionProgressEvent($district->election, config('laugh_chain.election_close_message')));
        }
        \Log::info('nft test 2');
        \Log::info('Election_id:' . Election::where('id', $district->election_id)->first()->id);
        \Log::info('best_user_public_key:' . Election::where('id', $district->election_id)->first()->best_user_public_key);
        // best_userがnullでないかつpublic_keyが設定されていればNFTを発行し送付
        $best_user_public_key = Election::where('id',$district->election_id)->first()->best_user_public_key;
        if ($best_user_public_key) {
        \Log::info('nft test 3');
            NFTService::mintNFT('localhost/'. $district->election_id, new PublicKey($best_user_public_key));
        }else{
            \Log::info("election_id:{$district->election_id}のbest_userが居ないか、public_keyが設定されていないためNFTが発行されませんでした");
        }
    }
}
