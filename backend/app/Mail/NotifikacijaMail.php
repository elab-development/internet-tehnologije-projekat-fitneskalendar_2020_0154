<?php

namespace App\Mail;

use App\Models\Dogadjaj;
use App\Models\Notifikacija;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NotifikacijaMail extends Mailable
{
    use Queueable, SerializesModels;
    public $notifikacija;
    public $dogadjaj;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Notifikacija $notifikacija,$dogadjaj)
    {
        $this->notifikacija = $notifikacija;
        $this->dogadjaj = $dogadjaj;
    }

    /**
     * Get the message envelope.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope()
    {
        // echo ("0");
        return new Envelope(
            subject: 'Notifikacija Mail',
        );
    }

    /**
     * Get the message content definition.
     *
     * @return \Illuminate\Mail\Mailables\Content
     */
    public function content()
    {
        return new Content(
            view: 'notifikacija',
        );
    }
    public function build()
    {
        return $this
        ->subject('Notifikacija za događaj: ' . $this->dogadjaj->naslov)
        ->view('notifikacija.blade')
        ->with([
            'notifikacija' => $this->notifikacija,
            'dogadjaj' => $this->dogadjaj
        ]);
        
    }

    /**
     * Get the attachments for the message.
     *
     * @return array
     */
    public function attachments()
    {
        // echo ("3");
        // return [];
    }
}
