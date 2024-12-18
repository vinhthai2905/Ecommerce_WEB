<?php
namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PodCastProcessed implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $data;

    public function __construct($message)
    {
        $this->data = $message;
    }

    public function broadcastOn()
    {
        return ['tsc-notifications'];
    }

    public function broadcastAs()
    {
        return 'send-notifications';
    }
}
