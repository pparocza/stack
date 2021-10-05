class Piece {
    
    constructor(){

    }

    initMasterChannel(){

        this.globalNow = 0;

        this.gain = audioCtx.createGain();
        this.gain.gain.value = 1.5;
    
        this.fadeFilter = new FilterFade(0);
    
        this.masterGain = audioCtx.createGain();
        this.masterGain.connect(this.gain);
        this.gain.connect(this.fadeFilter.input);
        this.fadeFilter.connect(audioCtx.destination);

    }

    initFXChannels(){

        // REVERB

            this.cSend = new MyGain( 1 );

            this.c = new MyConvolver();
            this.cB = new MyBuffer2( 2 , 2 , audioCtx.sampleRate );
            this.cB.noise().fill( 0 );
            this.cB.noise().fill( 1 );
            this.cB.ramp( 0 , 1 , 0.01 , 0.015 , 0.1 , 4 ).multiply( 0 );
            this.cB.ramp( 0 , 1 , 0.01 , 0.015 , 0.1 , 4 ).multiply( 1 );

            this.c.setBuffer( this.cB.buffer );

            this.cSend.connect( this.c );
            this.c.connect( this.masterGain );

        // DELAY

            this.dSend = new MyGain( 1 );
            this.d = new Effect();
            this.d.randomEcho();
            this.d.on();

            this.d.output.gain.value = 0.25;

    }

    load(){

            this.rC5 = new RampingConvolver( this );
            this.rC4 = new RampingConvolver( this );
            this.rC3 = new RampingConvolver( this );
            this.rC2 = new RampingConvolver( this );
            this.rC1 = new RampingConvolver( this );

            this.rC5A = new RampingConvolver( this );
            this.rC4A = new RampingConvolver( this );
            this.rC3A = new RampingConvolver( this );
            this.rC2A = new RampingConvolver( this );

            // RAMPING CONVOLVER

            this.fund = randomFloat( 350 , 450 );
            this.rate = 4; // randomFloat( 3.9 , 4.5 );
            this.gainVal = 1;

            console.log( `fund: ${this.fund} , rate: ${this.rate}` );
    
            // startTime , rate , rampArray , bufferLength , fund , frequencyRange , gainVal

                this.rC5.load( ( this.rate / 3 )  , [ 0 , 1 , 0.01 , 0.015 , 0.1 , 4 ] , randomArrayValue( [ 0.5 , 1 , 2 ])        , this.fund * 0.5 , [ 100 , 5000 ]  , this.gainVal * 3 );
                this.rC4.load( ( this.rate * 1 )  , [ 0 , 1 , 0.01 , 0.015 , 0.1 , 4 ] , randomArrayValue( [ 0.25 , 0.5 , 1 , 2 ]) , this.fund       , [ 100 , 1000 ]  , this.gainVal * 3 );
                this.rC3.load( ( this.rate * 2 )  , [ 0 , 1 , 0.01 , 0.015 , 0.1 , 4 ] , randomArrayValue( [ 0.25 , 0.5 , 1 , 2 ]) , this.fund       , [ 4000 , 7000 ] , this.gainVal * 3 );
                this.rC2.load( ( this.rate / 16 ) , [ 0 , 1 , 0.01 , 0.015 , 0.1 , 4 ] , randomArrayValue( [ 1 ])                  , this.fund       , [ 100 , 500 ]   , this.gainVal * 3 );
                this.rC1.load( ( this.rate / 32 ) , [ 0 , 1 , 0.01 , 0.015 , 0.1 , 4 ] , randomArrayValue( [ 2 ])                  , this.fund * 0.5 , [ 100 , 500 ]   , this.gainVal * 3 );
        
                this.rC5A.load( ( this.rate / 3 )  , [ 0 , 1 , 0.5 , 0.5 , 1 , 1 ]      , 2 ,  this.fund * 0.5 , [ 100 , 5000 ] , this.gainVal * 1.5 );
                this.rC4A.load( ( this.rate * 1 )  , [ 0 , 1 , 0.5 , 0.5 , 1 , 1 ]      , 2 ,  this.fund       , [ 100 , 1000 ] , this.gainVal * 1.5 );
                this.rC3A.load( ( this.rate / 16 ) , [ 0 , 1 , 0.99 , 0.999 , 5 , 0.5 ] , 2 ,  this.fund * 0.5 , [ 100 , 5000 ] , this.gainVal * 2.5 );
                this.rC2A.load( ( this.rate / 8)   , [ 0 , 1 , 0.99 , 0.999 , 5 , 0.5 ] , 2 ,  this.fund       , [ 100 , 1000 ] , this.gainVal * 2.5 );

            this.rCArray = [ this.rC1 , this.rC2 , this.rC3 , this.rC4 , this.rC5 , this.rC4A , this.rC5A , this.rC2A , this.rC3A ];

            this.generateStructure();

    }

    generateStructure(){

        this.qN = 4 * ( 1 / this.rate );
        this.bar = 4 * this.qN;
        this.nBars = 16;
        this.structureIdx = randomInt( 0 , 2 );

        switch( this.structureIdx){

            case 0: 
                console.log( 'random structure' );
                // minimumVoices
                this.randomStructure( 1 );
                break;

            case 1: 
                console.log( 'random range structure' );
                // minimumVoices , maximumVoices **
                this.randomRangeStructure( 1 , this.rCArray.length + 1 );
                break;

            case 2:
                console.log( 'spec arrangement structure' );
                // arrangementArray **
                this.specArrangementStructure( 
                    // if you replace each item with a randomInt, you can maintain a general
                    // arrangement contour, but still have variety between outputs
                    [ 5 , 2 , 5 , 1 , 3 , 6 , 2 , 7 , 1 , 8 , 7 , 6 , 5 , 4 , 3 , 1 ] 
                );
                break;

        }

        // modulus
        // this.moduloStructure( 2 );        

        // groupSize
        // this.twoGroups( 4 );

    }

    randomStructure( minimumVoices ){

        this.structureArray = [];

        for( let i = 0 ; i < this.nBars ; i++ ){

            this.structureArray[ i ] = [];

            for( let j = 0 ; j < this.rCArray.length - minimumVoices ; j++ ){

                this.structureArray[i].push( randomInt( 0 , 2 ) );

            }

            for( let j = 0 ; j < minimumVoices ; j++ ){

                this.structureArray[i].push( 1 );

            }

            shuffle( this.structureArray[i] );
            
        }

        console.log( this.structureArray );

    }

    moduloStructure( modulus ){

        this.structureArray = [];

        let k = 0;

        for( let i = 0 ; i < this.nBars ; i++ ){

            this.structureArray[ i ] = [];

            for( let j = 0 ; j < this.rCArray.length ; j++ ){

                if( k % modulus === 0 ){
                    this.structureArray[i].push( 1 );
                }
                else{ 
                    this.structureArray[i].push( 0 );
                };

                k++;

            }
            
        }

        console.log( this.structureArray );

    }

    randomRangeStructure( minimumVoices , maximumVoices ){

        this.structureArray = [];
        let nVoices = 0;

        for( let i = 0 ; i < this.nBars ; i++ ){

            this.structureArray[ i ] = [];

            nVoices = randomInt( minimumVoices , maximumVoices );

            for( let j = 0 ; j < nVoices ; j++ ){

                this.structureArray[i].push( 1 );

            }

            for( let j = 0 ; j < this.rCArray.length - nVoices ; j++ ){

                this.structureArray[i].push( 0 );

            }

            shuffle( this.structureArray[i] );
            
        }

        console.log( this.structureArray );

    }

    specArrangementStructure( arrangementArray ){

        this.structureArray = [];

        for( let i = 0 ; i < this.nBars ; i++ ){

            this.structureArray[ i ] = [];

            for( let j = 0 ; j < arrangementArray[ i ] ; j++ ){

                this.structureArray[i].push( 1 );

            }

            for( let j = 0 ; j < this.rCArray.length - arrangementArray[ i ] ; j++ ){

                this.structureArray[i].push( 0 );

            }

            shuffle( this.structureArray[i] );
            
        }

        console.log( this.structureArray );

    }

    twoGroups( groupSize ){

        this.structureArray = [];
        let k = 0;

        for( let i = 0 ; i < this.nBars ; i++ ){

            this.structureArray[ i ] = [];

            for( let j = 0 ; j < groupSize ; j++ ){

                this.structureArray[i].push( k % 2 === 1 ? randomInt( 0 , 2 ) : 0 );

            }

            for( let j = 0 ; j < this.rCArray.length - groupSize ; j++ ){

                this.structureArray[i].push( k % 2 === 0 ? randomInt( 0 , 2) : 0 );

            }

            k++;
            
        }

        shuffle( this.rCArray );

        console.log( this.structureArray );

    }

    start(){

        this.fadeFilter.start(1, 50);
		this.globalNow = audioCtx.currentTime;

        let r = 0;

        for( let i = 0 ; i < this.structureArray.length ; i++ ){

            for( let j = 0 ; j < this.structureArray[i].length ; j++ ){

                    if( this.structureArray[i][j] === 1 ){

                        this.rCArray[j].start( this.globalNow + ( this.bar * i ) , this.globalNow + ( this.bar * ( i + 1 ) ) );

                    }

            }

        }

    }

    stop() {

        this.fadeFilter.start(0, 20);
        startButton.innerHTML = "reset";

    }

}

class RampingConvolver{

    constructor( piece ){

        this.output = new MyGain( 0 );

        this.output.connect( piece.masterGain );
        this.output.connect( piece.cSend );
        this.output.connect( piece.dSend );

    }

    load( rate , rampArray , bufferLength , fund , frequencyRange , gainVal ){

        this.output.gain.gain.value = gainVal;

        this.c = new MyConvolver();
        this.cB = new MyBuffer2(  1 , bufferLength , audioCtx.sampleRate );
        this.cAB = new MyBuffer2( 1 , bufferLength , audioCtx.sampleRate );

        const iArray = [ 1 , M2 , M3 , P4 , P5 , M6 , 2 ];
        const oArray = [ 1 , 4 , 2 ];

        let interval = 0;
        let o = 0;
        let p = 0;

        for( let i = 0 ; i < 20 ; i++ ){

            interval = randomArrayValue( iArray );
            o = randomArrayValue( oArray );
            p = randomFloat( 0.1 , 0.9 );

            this.cAB.fm( fund * interval * o , fund * interval * o , 0.5 ).add( 0 );
            this.cAB.constant( 1 / o ).multiply( 0 );
            this.cAB.ramp( p , p + 0.1 , 0.5 , 0.5 , 0.1 , 0.1 ).multiply( 0 );

            this.cB.addBuffer( this.cAB.buffer );

        }

        this.cB.normalize( -1 , 1 );

        this.c.setBuffer( this.cB.buffer );

        // NOISE

        this.noise = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.noise.noise().fill( 0 );
        this.noise.playbackRate = 0.25;
        this.noise.loop = true;
        this.noise.output.gain.value = 0.1;

        // NOISE FILTER

        this.noiseFilter = new MyBiquad( 'bandpass' , 0 , 1 );

        // AM

        this.aG = new MyGain( 0 );
        this.aB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.aB.ramp( ...rampArray ).fill( 0 );
        this.aB.loop = true;
        this.aB.playbackRate = rate;

        this.aF = new MyBiquad( 'lowpass' , 500 , 1 );

        // PAN

        this.p = new MyPanner2( 0 );

        this.noise.connect( this.noiseFilter );
        this.noiseFilter.connect( this.c );
        this.aB.connect( this.aF );
        this.c.connect( this.aG ); this.aF.connect( this.aG.gain.gain );

        // SEQUENCE GAIN

        this.sG = new MyGain ( 0 );

        this.aG.connect( this.p );
        this.p.connect( this.sG );
        this.sG.connect( this.output );

        this.c.output.gain.value = 1;

        // FILTER SEQUENCE

        const sL = randomInt( 4 , 11 );

        let fSeq = new Sequence();
        fSeq.randomInts( sL , frequencyRange[ 0 ] , frequencyRange[ 1 ] );

        fSeq = fSeq.sequence;

        let t = 0;

        for( let i = 0 ; i < 1000 ; i++ ){

            t = i / rate;

            this.p.setPositionAtTime( randomFloat( -1 , 1 ) , t );
            this.sG.gain.gain.setValueAtTime( randomFloat( 0.5 , 4 ) , t );
            this.noiseFilter.biquad.frequency.setValueAtTime( fSeq[ i % fSeq.length ] , t );

        }

    }

    start( startTime , stopTime ){

        this.noise.startAtTime( startTime );
        this.aB.startAtTime( startTime );

        this.noise.stopAtTime( stopTime );
        this.aB.stopAtTime( stopTime );

    }

}