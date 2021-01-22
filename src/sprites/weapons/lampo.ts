import Game from '~/scenes/game';
import Segment from '~/utils/segment';
import {
    LAMPO_GENERAZIONI,
    LAMPO_MAXOFFSET,
    LAMPO_SCALA
} from '~/constants.json';

export default class Lampo {
    generazioni!: number;
    maxOffset!: number;
    scala!: number;
    scene!: Game;
    random!:boolean
    constructor(scene: Game, generazioni: number, maxOffset: number, scala: number) {
        this.scene = scene;
        this.generazioni = LAMPO_GENERAZIONI;
        this.maxOffset = LAMPO_MAXOFFSET;
        this.scala = LAMPO_SCALA;
    }

    generazione(startPointX: number, startPointY: number, endPointX: number, endPointY: number, level:number) {
        const listaSegmenti: Segment[] = []; //array vuoto
        // const nuovaLista: Segment[] = []; //un altro array di appoggio
        let segmento1 = new Segment(this.scene, startPointX, startPointY, endPointX, endPointY, level);
        listaSegmenti.push(segmento1); //metto nell'array un primo segmento che va dal punto iniziale a quello finale
        let offsetSegmento = this.maxOffset; //il massimo Offset che posso dare ad un vertice del segmento

        for (let i = 0; i < this.generazioni; i++) {
            console.log('ciclo 1');
            listaSegmenti.forEach((segmento) =>{
            //for (const oldsegment in listaSegmenti) { //per tutti gli elementi del primo array
                console.log('ciclo 2');
                // console.log(vecchioSegmento);
                //const segmento = new Segment(this.scene, startPointX, startPointY, endPointX, endPointY, 1); // fai un altro segmento
                console.log(listaSegmenti[0]);
                console.log(listaSegmenti[1]);
                console.log(listaSegmenti[2]);
                console.log(listaSegmenti[3]);                             
                let puntoMedioX = Phaser.Math.Average([listaSegmenti[0].startX, listaSegmenti[0].endX]); //calcola il punto medio delle coordinate X dei punti iniziale e finale
                console.log(puntoMedioX, segmento.startX, segmento.endX);
                let puntoMedioY = Phaser.Math.Average([listaSegmenti[0].startY, listaSegmenti[0].endY]); //calcola il punto medio delle coordinate Y dei punti iniziale e finale
                console.log(puntoMedioY, segmento.startY, segmento.endY);
                

                //trascina il punto medio per un estensione casuale lungo la normale al segmento
                const angolo = Math.atan2(listaSegmenti[0].endY - listaSegmenti[0].startY, listaSegmenti[0].endX - listaSegmenti[0].startX); //calcolo angolo di inclinazione del segmento
                console.log(angolo);
                const randomOffset = Phaser.Math.RND.between(-offsetSegmento, offsetSegmento); // prendi un offset random tra quelli massimi negativo e positivo
                console.log(randomOffset);
                const x1 = Math.sin(angolo) * randomOffset + puntoMedioX;
                console.log(x1);
                const y1 = -Math.cos(angolo) * randomOffset + puntoMedioY;
                console.log(y1);
                const x2 = -Math.sin(angolo) * randomOffset + puntoMedioX;
                console.log(x2);
                const y2 = Math.cos(angolo) * randomOffset + puntoMedioY;
                console.log(y2);

                if (this.random = Phaser.Math.RND.between(-1, 1) < 0) {                     //sceglie tra una estensione a sx o a dx oppure sopra/sotto
                    console.log(this.random);
                    puntoMedioX = x1;
                    puntoMedioY = y1;
                } else {
                    console.log(this.random);
                    puntoMedioX = x2;
                    puntoMedioY = y2;
                }
                listaSegmenti.push(new Segment(this.scene, listaSegmenti[0].startX, listaSegmenti[0].startY, puntoMedioX, puntoMedioY, listaSegmenti[0].level));
                listaSegmenti.push(new Segment(this.scene, puntoMedioX, puntoMedioY, listaSegmenti[0].endX, listaSegmenti[0].endY, listaSegmenti[0].level));   
                listaSegmenti.splice(0,1);              
                console.log(listaSegmenti.length);
                               

                /*if (i === 0 || i === 2) {
                    const distanza = Math.sqrt(Math.pow(puntoMedioX - startPointX, 2) + Math.pow(puntoMedioY - startPointY, 2));
                    const endPointDiviso = {
                        x: endPointX,
                        y: endPointY
                    };
                    let angoloSuddivisione;
                    if (Phaser.Math.RND.between(0, 2) < 1) {
                        angoloSuddivisione = Phaser.Math.RND.between(-0.8, -0.2);
                    } else {
                        angoloSuddivisione = Phaser.Math.RND.between(0.2, 0.8);
                    }
                    Phaser.Math.RotateAroundDistance(endPointDiviso, puntoMedioX, puntoMedioY, angoloSuddivisione, this.scala * distanza);

                    listaSegmenti.push(new Segment(this.scene, puntoMedioX, puntoMedioY, endPointDiviso.x, endPointDiviso.y, 1 + 1));

                }*/

            })

            offsetSegmento /= 2;
            // listaSegmenti = nuovaLista;
        }
        return listaSegmenti;
    }

}