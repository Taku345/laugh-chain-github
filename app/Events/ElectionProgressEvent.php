<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ElectionProgressEvent implements shouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $election;
    public $message;
    public $type;

    /**
     * Create a new event instance.
     */
    public function __construct($election, $message, $type = null)
    {
        $this->election = $election;
        $this->message = $message;
        $this->type = $type;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('election-progress'),
            new Channel('election-progress.'.$this->election->id),
        ];
    }
}
