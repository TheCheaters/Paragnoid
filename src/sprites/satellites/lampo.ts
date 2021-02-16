import Game from '~/scenes/game';
import Segment from '~/sprites/satellites/Segment';
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
    random!: number;
    random2!: number;
    random3!: number;
    constructor(scene: Game, generazioni: number, maxOffset: number, scala: number) {
        this.scene = scene;
        this.generazioni = LAMPO_GENERAZIONI;
        this.maxOffset = LAMPO_MAXOFFSET;
        this.scala = LAMPO_SCALA;
    }

    generazione2(startPointX: number, startPointY: number, endPointX: number, endPointY: number, level: number): Segment {
        const segmentoiniziale = new Segment(this.scene, startPointX, startPointY, endPointX, endPointY, level, LAMPO_MAXOFFSET);
        return segmentoiniziale;
    }

    funzioneT(segmento: Segment): Segment[] {
        const listaSegmenti: Segment[] = [];
        //let offsetSegmento = this.maxOffset; //il massimo Offset che posso dare ad un vertice del segmento
        //console.log(offsetSegmento);
        let puntoMedioX = Phaser.Math.Average([segmento.startX, segmento.endX]); //calcola il punto medio delle coordinate X dei punti iniziale e finale
        let puntoMedioY = Phaser.Math.Average([segmento.startY, segmento.endY]); //calcola il punto medio delle coordinate Y dei punti iniziale e finale
        console.log(segmento.startX, segmento.endX, puntoMedioX);
        console.log(segmento.startY, segmento.endY, puntoMedioY);
        //trascina il punto medio per un estensione casuale lungo la normale al segmento
        const angolo = Math.atan2(segmento.endY - segmento.startY, segmento.endX - segmento.startX); //calcolo angolo di inclinazione del segmento
        console.log(angolo);
        const randomOffset = Phaser.Math.RND.between(-segmento.offset, segmento.offset); // prendi un offset random tra quelli massimi negativo e positivo
        console.log(randomOffset);
        const x1 = Math.sin(angolo) * randomOffset + puntoMedioX;
        const y1 = -Math.cos(angolo) * randomOffset + puntoMedioY;
        const x2 = -Math.sin(angolo) * randomOffset + puntoMedioX;
        const y2 = Math.cos(angolo) * randomOffset + puntoMedioY;
        console.log(x1, y1, x2, y2);
        this.random = Phaser.Math.RND.between(-1, 1);
        console.log(this.random);
        if (this.random < 0) { //sceglie tra una estensione a sx o a dx oppure sopra/sotto
            // console.log(this.random);
            puntoMedioX = x1;
            puntoMedioY = y1;
        } else {
            // console.log(this.random);
            puntoMedioX = x2;
            puntoMedioY = y2;
        }
        listaSegmenti.push(new Segment(this.scene, segmento.startX, segmento.startY, puntoMedioX, puntoMedioY, segmento.level, segmento.offset/2));
        listaSegmenti.push(new Segment(this.scene, puntoMedioX, puntoMedioY, segmento.endX, segmento.endY, segmento.level, segmento.offset/2));
        console.log(segmento.offset);
        this.random2 = Phaser.Math.RND.between(0, 2);
        console.log(this.random2);
        if (this.random2 < 1) {
            const direzione = Math.sqrt(Math.pow(puntoMedioX - segmento.startX, 2) + Math.pow(puntoMedioY - segmento.startY, 2));
            console.log(direzione);
            const endPointBranch = {
                x: segmento.endX,
                y: segmento.endY
            };
            console.log(segmento.endX, segmento.endY);
            let angoloSuddivisione;
            this.random3 = Phaser.Math.RND.between(0, 2);
            console.log(this.random3);
            if (this.random3 < 1) {
                angoloSuddivisione = Phaser.Math.RND.realInRange(-0.8, -0.2);
            } else {
                angoloSuddivisione = Phaser.Math.RND.realInRange(0.2, 0.8);
            }
            console.log(angoloSuddivisione);
            Phaser.Math.RotateAroundDistance(endPointBranch, puntoMedioX, puntoMedioY, angoloSuddivisione, this.scala * direzione);
            listaSegmenti.push(new Segment(this.scene, puntoMedioX, puntoMedioY, endPointBranch.x, endPointBranch.y, listaSegmenti[0].level + 1, segmento.offset/2));


        }
        console.log(segmento.offset);
        return listaSegmenti;

    }


}