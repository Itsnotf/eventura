<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VendorApplicationRejected extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly string $brandName,
        public readonly string $applicantName,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Update Aplikasi {$this->brandName} — Eventura")
            ->markdown('mail.vendor-application-rejected', [
                'brandName' => $this->brandName,
                'name'      => $this->applicantName,
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [];
    }
}
