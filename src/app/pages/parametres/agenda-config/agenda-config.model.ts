import { AgendaType } from 'app/core/enums/agenda-type.enum';
import { IEchangeCommercial } from 'app/pages/agenda-commercial/agenda-commercial.model';

/** an interface describe agenda config */
export interface IAgendaConfig {

    /** the id of agenda config */
    id: string;

    /** name of agenda config */
    name: string;

    /** type of agenda config */
    type: AgendaType;

    /** list of Categorie Evenement */
    echangeCommercials: IEchangeCommercial[];
}

export interface IAgendaConfigModel {

    /** name of agenda config */
    name: string;

    /** type of agenda config */
    type: AgendaType;
}

export interface IAgendaConfigDataTables {

    /**
     * the id of agenda config
     */
    id: string;

    /**
     * the name of agenda config
     */
    name: string;

}
