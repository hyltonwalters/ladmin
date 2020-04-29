@extends('layouts.master')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <a href="/dashboard">
                    <div class="card-header">Dashboard</div>
                </a>

                <div class="card-body">
                    @if (session('status'))
                    <div class="alert alert-success" role="alert">
                        {{ session('status') }}
                    </div>
                    @endif

                    Welcome!
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
