import { Scene } from "phaser";
import Game from '~/scenes/game';
import Segment from '~/utils/segment';
import { LAMPO_GENERAZIONI, LAMPO_MAXOFFSET, LAMPO_SCALA } from '~/constants.json';

export default abstract class Lampo extends Phaser.GameObjects.Graphics {
        generazioni !: number;
        maxOffset !: number;
        scala !: number;
        
        constructor(scene: Scene, generazioni: number, maxOffset: number, scala: number){
            super(scene);
            this.generazioni = LAMPO_GENERAZIONI;
            this.maxOffset = LAMPO_MAXOFFSET;
            this.scala = LAMPO_SCALA;                            
        }

generazione(startPointX: number, startPointY: number, endPointX: number, endPointY: number){
    let listaSegmenti = Array(); //array vuoto
    listaSegmenti.push(new Segment(this.scene, startPointX, startPointY, endPointX, endPointY, 1)); //metto nell'array un primo segmento che va dal punto iniziale a quello finale
    let offsetSegmento = this.maxOffset; //il massimo Offset che posso dare ad un vertice del segmento

    for (let i=0; i<this.generazioni; i++){
        let nuovaLista = Array(); //un altro array di appoggio
        for (const vecchioSegmento of listaSegmenti) { //per tutti gli elementi del primo array
            let segmento = vecchioSegmento.clone(); // fai un altro segmento
            let puntoMedioX = Phaser.Math.Average([startPointX, endPointX]); //calcola il punto medio delle coordinate X dei punti iniziale e finale
            let puntoMedioY = Phaser.Math.Average([startPointY, endPointY]); //calcola il punto medio delle coordinate Y dei punti iniziale e finale

            //trascina il punto medio per un estensione casuale lungo la normale al segmento
            const angolo = Math.atan2(segmento.endPointY-segmento.startPointY, segmento.endPointX - segmento.startPointX); //calcolo angolo di inclinazione del segmento
            const randomOffset = Phaser.Math.RND.between(-offsetSegmento, offsetSegmento); // prendi un offset random tra quelli massimi negativo e positivo
            const x1 = Math.sin(angolo) * randomOffset + puntoMedioX; 
            const y1 = -Math.cos(angolo) * randomOffset + puntoMedioY;
            const x2 = -Math.sin(angolo) * randomOffset + puntoMedioX;
            const y2 = Math.cos(angolo) * randomOffset + puntoMedioY;

            if (Phaser.Math.RND.between(-1, 1)<0) { //sceglie tra una estensione a sx o a dx
                puntoMedioX = x1;
                puntoMedioY = y1;
            } else {
                puntoMedioX = x2;
                puntoMedioY = y2;
            }
            nuovaLista.push(new Segment(this.scene, segmento.startPointX, segmento.startPointY, puntoMedioX, puntoMedioY, segmento.level));
            nuovaLista.push(new Segment(this.scene, puntoMedioX, puntoMedioY, segmento.endPointX, segmento.endPointY, segmento.level));

            if (i === 0 || i === 2) {
                const distanza = Math.sqrt(Math.pow(puntoMedioX-segmento.startPointX, 2) + Math.pow(puntoMedioY - segmento.startPointY, 2));
                const endPointDiviso = {
                    x: segmento.endPointX,
                    y: segmento.endPointY
                };
                let angoloSuddivisione;
                if (Phaser.Math.RND.between(0,2)<1){
                    angoloSuddivisione = Phaser.Math.RND.between(-0.8, -0.2);
                } else {
                    angoloSuddivisione = Phaser.Math.RND.between(0.2, 0.8);
                }
                Phaser.Math.RotateAroundDistance(endPointDiviso, puntoMedioX, puntoMedioY, angoloSuddivisione, this.scala * distanza);

                nuovaLista.push(new Segment(this.scene, puntoMedioX, puntoMedioY, endPointDiviso.x, endPointDiviso.y, segmento.level + 1));

            }

        }

        offsetSegmento /= 2;
        listaSegmenti = nuovaLista;
    }
return listaSegmenti;
}
    
}