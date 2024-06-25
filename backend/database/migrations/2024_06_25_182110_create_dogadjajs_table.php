<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('dogadjajs', function (Blueprint $table) {   
            $table->id();
            $table->unsignedBigInteger('idTipaDogadjaja');
            $table->unsignedBigInteger('idKorisnika');
            $table->dateTime('datumVremeOd');
            $table->dateTime('datumVremeDo');
            $table->text('opis')->nullable();
            $table->string('lokacija');
            $table->string('naslov');
            $table->boolean('privatnost');
            $table->timestamps();
           
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('dogadjajs');
    }
};
