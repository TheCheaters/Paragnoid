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
    constructor(scene: Game, generazioni: number, maxOffset: number, scala: number) {
        this.scene = scene;
        this.generazioni = LAMPO_GENERAZIONI;
        this.maxOffset = LAMPO_MAXOFFSET;
        this.scala = LAMPO_SCALA;
    }

    generazione(startPointX: number, startPointY: number, endPointX: number, endPointY: number) {
        const listaSegmenti: Segment[] = []; //array vuoto
        // const nuovaLista: Segment[] = []; //un altro array di appoggio
        let segmento1 = new Segment(this.scene, startPointX, startPointY, endPointX, endPointY, 1);
        listaSegmenti.push(segmento1); //metto nell'array un primo segmento che va dal punto iniziale a quello finale
        let offsetSegmento = this.maxOffset; //il massimo Offset che posso dare ad un vertice del segmento

        for (let i = 0; i < this.generazioni; i++) {
            console.log('ciclo 1');
            //for (let i = 0; i < this.generazioni; i++) {
            for (const oldsegment in listaSegmenti) { //per tutti gli elementi del primo array
                console.log('ciclo 2');
                // console.log(vecchioSegmento);
                //const segmento = new Segment(this.scene, startPointX, startPointY, endPointX, endPointY, 1); // fai un altro segmento
                listaSegmenti.pop();
                let puntoMedioX = Phaser.Math.Average([startPointX, endPointX]); //calcola il punto medio delle coordinate X dei punti iniziale e finale
                console.log(puntoMedioX, startPointX, endPointX);
                let puntoMedioY = Phaser.Math.Average([startPointY, endPointY]); //calcola il punto medio delle coordinate Y dei punti iniziale e finale
                console.log(puntoMedioY, startPointY, endPointY);

                //trascina il punto medio per un estensione casuale lungo la normale al segmento
                const angolo = Math.atan2(endPointY - startPointY, endPointX - startPointX); //calcolo angolo di inclinazione del segmento
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

                if (Phaser.Math.RND.between(-1, 1) < 0) { //sceglie tra una estensione a sx o a dx
                    puntoMedioX = x1;
                    puntoMedioY = y1;
                } else {
                    puntoMedioX = x2;
                    puntoMedioY = y2;
                }
                listaSegmenti.push(new Segment(this.scene, startPointX, startPointY, puntoMedioX, puntoMedioY, 1));
                listaSegmenti.push(new Segment(this.scene, puntoMedioX, puntoMedioY, endPointX, endPointY, 1));
                

                if (i === 0 || i === 2) {
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

                }

            }

            offsetSegmento /= 2;
            // listaSegmenti = nuovaLista;
        }
        return listaSegmenti;
    }

}