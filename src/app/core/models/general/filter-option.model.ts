import { EchangeCommercialType } from './../../enums/echange-commercial-type.enum';
import { SortDirection } from '../../enums/sort-direction';
import { NumerationType } from 'app/core/enums/numerotation.enum';
import { PeriodeComptableFilter } from 'app/core/enums/periode-comptable.enum';
import { ClientType } from 'app/core/enums/client-type.enum';
import { DossierStatus } from '../../enums/dossier-status.enums';
import { AvoirStatus } from 'app/core/enums/avoir-status.enum';
import { FactureStatus } from 'app/core/enums/facture-status.enum';
import { DevisStatus } from 'app/core/enums/devis-status.enum';
import { DevisType } from 'app/core/enums/devis-type.enum';
import { AgendaType } from 'app/core/enums/agenda-type.enum';

/**
 * the interface that describe the filtering options
 */
export interface IFilterOption {

    /**
     * the search Query to search with it
     */
    SearchQuery: string;

    /**
     * the page index
     */
    Page: number;

    /**
     * the size of the page
     */
    PageSize: number;

    /**
     * the Sort Direction
     */
    SortDirection: SortDirection;

    /**
     * what property to order by with it
     */
    OrderBy: string;
}

/**
 * the filter of client
 */
export interface IClientFilterOption extends IFilterOption {

    /**
     * the type of client
     */
    types?: ClientType[];

    /** the type of client */
    type?: ClientType;

}

/**
 * the filter option from city
 */
export interface ICityFilterOption extends IFilterOption {

    /**
     * the department id
     */
    departmentId?: string;
}


/**
 * the filter users by roleid
 */
export interface IUserFilterOption extends IFilterOption {

    /**
     * roles id
     */
    rolesId?: number[];

    /**
     * get all users
     */
    isAll?: boolean;

    /**
     * the id of Agence
     */
    agenceId?: string;

}
export interface IDepartmentFilterOption extends IFilterOption {
    /**
     * the country id
     */
    countryId?: string;
}

/**
 * a interface describe body of method generate reference accounting document
 */
export interface IBodyReferenceDocumentComptable {

    /**
     * the date of creation
     */
    dateCreation: Date;

    /**
     * the type of numerotation
     */
    type: NumerationType;
}

/**
 * a interface describe sales journal filter options
 */
export interface ISalesJournalFilterOption extends IFilterOption {
    isForAgence?: boolean;
    period?: PeriodeComptableFilter;
    dateFrom?: Date;
    dateTo?: Date;
}
/**
 * a interface describe account journal filter options
 */
export interface IAccountJournalFilterOption extends IFilterOption {
    isForCaisse?: boolean;
    period?: PeriodeComptableFilter;
    dateFrom?: Date;
    dateTo?: Date;
}

/**
 * a interface describe Echange Commercial filter options
 */
export interface IEchangeCommercialFilterOption extends IFilterOption {

    /** the id of Echange Commercial */
    responsableId?: string;

    /** the category of Echange Commercial */
    categorieId?: string;

    /** the id of Echange Commercial */
    type?: EchangeCommercialType;

    /** the id of Echange Commercial */
    dossierId?: string;

    /** the client id of Echange Commercial */
    clientId?: string;

    /**
     * the date of start
     */
    dateFrom?: Date;

    /**
     * the date of end
     */
    dateTo?: Date

}

export interface ICommercialPlanningFilterOption extends IFilterOption {

    dateRDV: Date;
}

export interface CheckUserAssignedSameDateAndHourFilterOption {
    dateRdv: string;
    userId: string;
    excludeDossierId: string;
}

/** interface describe dossier filter options */
export interface IDossierFilterOption extends IFilterOption {

    clientId?: string;

    /** date start */
    dateRdvFrom?: Date;

    /** date start */
    dateRdvTo?: Date;

    /** status */
    status?: DossierStatus;
}

/** interface describe paiement filter options */
export interface IPaimentFilterOption extends IFilterOption {

    // the date from
    dateFrom?: Date;

    // the date to
    dateTo?: Date;

    // the id of bank account
    bankAccountId?: string;
}

/** interface describe facture filter options */
export interface IFactureFilterOption extends IFilterOption {

    /** the facture status */
    status?: FactureStatus[];

    /** the date from */
    dateFrom?: Date;

    /** the date to */
    dateTo?: Date;

    /** the client id */
    clientId?: string;

    /** Prime Cee Id */
    primeCeeId?: string;

}

/** interface describe avoir filter options */
export interface IAvoirFilterOption extends IFilterOption {

    /** the avoir status */
    status?: AvoirStatus[];

    /** the date from */
    dateFrom?: Date;

    /** the date to */
    dateTo?: Date;

    /** the client id */
    clientId?: string;

    /** max total  */
    maxTotal?: number;

}

/** interface describe devis filter options */
export interface IDevisFilterOption extends IFilterOption {

    /** the client id */
    clientId?: string;

    /** the type of devis */
    type?: DevisType;

    /** status */
    status?: DevisStatus[];
}

export interface IReleveFacturesFilterOption {

    /** clientId */
    clientId?: string;

    /** date From */
    dateFrom: Date;

    /** date To */
    dateTo: Date;

    /** the facture unpaid */
    isUnpaid: boolean;

    /** include facture */
    includeFactures: boolean;
}

/** the interface describe dashboard filtre option */
export interface IDashboardFilterOption {

    /** filtre by date from */
    dateFrom: string;

    /** filtre by date to */
    dateTo: string;

    /** filtre by client */
    clientId?: string;

    /** filtre by agence */
    agenceId?: string;

    /** filtre by period */
    period?: PeriodeComptableFilter;
}

export interface IAdvanceDashboardFilterOption extends IDashboardFilterOption {
    userId?: string;
}

export interface IFacturesArticlesByCategoryFilterOption extends IAdvanceDashboardFilterOption {
    categoryId?: string;
}

export interface ISmsFilterOption extends IFilterOption {
    clientId?: string;
    dossierId?: string;
}

/**
 * a class describe Agenda Evenement filter option
 */
export interface IAgendaEvenementFilterOption extends IFilterOption {

    /**  the type of agenda évènement */
    type: AgendaType;
}
