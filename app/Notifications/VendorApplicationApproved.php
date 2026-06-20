<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VendorApplicationApproved extends Notification
{

    public function __construct(
        public readonly string $brandName,
        public readonly string $resetUrl,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Selamat! Aplikasi {$this->brandName} Disetujui — " . config('app.name'))
            ->markdown('mail.vendor-application-approved', [
                'brandName' => $this->brandName,
                'resetUrl'  => $this->resetUrl,
                'name'      => $notifiable->name,
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [];
    }
}
