<?php

namespace App\Jobs;

use App\Services\NotificationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    protected $role;
    protected $message;

    public function __construct($role, $message)
    {
        $this->role = $role;
        $this->message = $message;
    }

    /**
     * Execute the job.
     */
    public function handle(NotificationService $notify): void
    {
        $notify->sendToRole($this->role, $this->message);
    }
}
