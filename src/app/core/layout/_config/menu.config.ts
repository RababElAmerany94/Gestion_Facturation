import { Modules } from 'app/core/enums/modules.enum';
import { RouteName } from 'app/core/enums/route-name.enum';
import { CopyHelper } from 'app/core/helpers/copy';
import { StringHelper } from 'app/core/helpers/string';

/**
 * an interface describe menu config
 */
export interface IMenuConfig {
    aside: IAsideConfig;
}

/**
 * an interface describe aside config
 */
export interface IAsideConfig {
    self: any;

    /**
     * the menu items
     */
    items: (IMenuItem | IMenuSection)[];
}


/**
 * an interface describe menu item
 */
export interface IMenuItem {

    /**
     * the id of menu item
     */
    moduleId?: string;

    /**
     * the title of menu item
     */
    title: string;

    /**
     * the root menu item
     */
    root?: boolean;

    /**
     * the icon of menu item
     */
    icon?: string;

    /**
     * the URL of menu item
     */
    page?: string;

    /**
     * the translate of title
     */
    translate: string;

    /**
     * the type of shape left item
     */
    bullet?: string;

    /**
     * subs menu
     */
    submenu?: IMenuItem[];
}

/**
 * an interface describe menu section
 */
export interface IMenuSection {
    section: string;
}

/**
 * is IMenuSection Item
 */
export function isIMenuSection(menuItem: (IMenuItem | IMenuSection)) {
    return !StringHelper.isEmptyOrNull((menuItem as IMenuSection).section);
}

export class MenuConfig {
    private static defaults: IMenuConfig = {
        aside: {
            self: {},
            items: [
                {
                    moduleId: Modules.Home,
                    title: RouteName.Dashboard,
                    root: true,
                    icon: 'flaticon2-analytics',
                    page: `/${RouteName.Dashboard}`,
                    translate: 'MENU.DASHBOARD',
                    bullet: 'dot',
                    submenu: [
                        {
                            moduleId: Modules.Home,
                            title: RouteName.SuiviActivite,
                            page: `/${RouteName.Dashboard}/${RouteName.SuiviActivite}`,
                            translate: 'MENU.SUIVI_ACTIVITE',
                        },
                    ]
                },
                {
                    moduleId: Modules.Users,
                    title: RouteName.Utilisateurs,
                    root: true,
                    icon: 'flaticon2-avatar',
                    page: `/${RouteName.Utilisateurs}`,
                    translate: 'MENU.USERS',
                    bullet: 'dot',
                },
                {
                    moduleId: Modules.Agences,
                    title: RouteName.Agence,
                    root: true,
                    icon: 'flaticon2-box',
                    page: `/${RouteName.Agence}`,
                    translate: 'MENU.Agence',
                    bullet: 'dot',
                },
                {
                    moduleId: Modules.Produits,
                    title: RouteName.Produits,
                    root: true,
                    icon: 'flaticon2-layers',
                    page: `/${RouteName.Produits}`,
                    translate: 'MENU.PRODUCTS',
                    bullet: 'dot',
                },
                {/** A revoir backend */
                    moduleId: Modules.Dossiers,
                    title: RouteName.Dossier,
                    root: true,
                    icon: 'flaticon2-folder',
                    page: `/${RouteName.Dossier}`,
                    translate: 'MENU.DOSSIERS',
                    bullet: 'dot',
                },
                {
                    moduleId: Modules.Devis,
                    title: RouteName.Devis,
                    root: true,
                    icon: 'flaticon2-google-drive-file',
                    page: `/${RouteName.Devis}`,
                    translate: 'MENU.DEVIS',
                    bullet: 'dot',
                },
                {
                    moduleId: Modules.BonCommande,
                    title: RouteName.BonCommande,
                    root: true,
                    icon: 'flaticon2-file',
                    page: `/${RouteName.BonCommande}`,
                    translate: 'MENU.BON_COMMANDE',
                    bullet: 'dot',
                },
                {
                    moduleId: Modules.AgendaCommercial,
                    title: RouteName.AgendaCommercial,
                    root: true,
                    icon: 'flaticon2-calendar',
                    page: `/${RouteName.AgendaCommercial}`,
                    translate: 'MENU.AGENDA',
                    bullet: 'dot',
                },
                { section: 'MENU.CONTACTS' },
                {
                    moduleId: Modules.Clients,
                    title: RouteName.Clients,
                    root: true,
                    icon: 'flaticon2-user',
                    page: `/${RouteName.Clients}`,
                    translate: 'MENU.CLIENTS',
                    bullet: 'dot',
                },
                {
                    moduleId: Modules.Fournisseurs,
                    title: RouteName.Suppliers,
                    root: true,
                    icon: 'flaticon2-delivery-package',
                    page: `/${RouteName.Suppliers}`,
                    translate: 'MENU.SUPPLIERS',
                    bullet: 'dot',
                },
                { section: 'MENU.FACTURATION' },
                {
                    moduleId: Modules.Facture,
                    title: RouteName.Facture,
                    root: true,
                    icon: 'flaticon2-file',
                    page: `/${RouteName.Facture}`,
                    translate: 'MENU.FACTURE',
                    bullet: 'dot',
                },
                {
                    moduleId: Modules.Avoir,
                    title: RouteName.Avoir,
                    root: true,
                    icon: 'flaticon2-checking',
                    page: `/${RouteName.Avoir}`,
                    translate: 'MENU.AVOIR',
                    bullet: 'dot',
                },
                {
                    moduleId: Modules.Paiement,
                    title: RouteName.Paiement,
                    root: true,
                    icon: 'flaticon2-list-1',
                    page: `/${RouteName.Paiement}`,
                    translate: 'MENU.PAIEMENT',
                    bullet: 'dot',
                },
                {
                    moduleId: Modules.Accounting,
                    title: RouteName.Comptabilite,
                    root: true,
                    icon: 'flaticon2-box-1',
                    page: `/${RouteName.Comptabilite}`,
                    translate: 'MENU.COMPTABILITE',
                    bullet: 'dot',
                },
                { section: 'MENU.PARAMETERS' },
                {
                    title: RouteName.Parameters,
                    icon: 'flaticon2-settings',
                    root: true,
                    translate: 'MENU.PARAMETERS',
                    submenu: [
                        {
                            moduleId: Modules.Parameters,
                            title: RouteName.ConfigurationAgenda,
                            page: `/${RouteName.Parameters}/${RouteName.ConfigurationAgenda}`,
                            translate: 'MENU.CONFIGURATION_AGENDA',
                        },
                        {
                            moduleId: Modules.Parameters,
                            title: RouteName.SpecialArticle,
                            page: `/${RouteName.Parameters}/${RouteName.SpecialArticle}`,
                            translate: 'MENU.ARTICLES_SPECIAUX',
                        },
                        {
                            moduleId: Modules.Parameters,
                            title: RouteName.CategoryDocument,
                            page: `/${RouteName.Parameters}/${RouteName.CategoryDocument}`,
                            translate: 'MENU.CATEGORY_DCUMENT',
                        },
                        {
                            moduleId: Modules.CategoryProduct,
                            title: RouteName.CategoryProduct,
                            page: `/${RouteName.Parameters}/${RouteName.CategoryProduct}`,
                            translate: 'MENU.CATEGORY_PRODUCT',
                        },
                        {
                            moduleId: Modules.ChampSiteInstallation,
                            title: RouteName.ChampSiteInstallation,
                            page: `/${RouteName.Parameters}/${RouteName.ChampSiteInstallation}`,
                            translate: 'MENU.CHAMPS_SITE_INSTALLATION',
                        },
                        {
                            moduleId: Modules.Parameters,
                            title: RouteName.BankAccounts,
                            page: `/${RouteName.Parameters}/${RouteName.BankAccounts}`,
                            translate: 'MENU.BANK_ACCOUNT',
                        },
                        {
                            moduleId: Modules.Parameters,
                            title: RouteName.Messaging,
                            page: `/${RouteName.Parameters}/${RouteName.Messaging}`,
                            translate: 'MENU.MESSAGING',
                        },
                        {
                            moduleId: Modules.ModesReglement,
                            title: RouteName.ModeReglement,
                            page: `/${RouteName.Parameters}/${RouteName.ModeReglement}`,
                            translate: 'MENU.MODE_REGLEMENT',
                        },
                        {
                            moduleId: Modules.ModeleSms,
                            title: RouteName.ModeleSMS,
                            page: `/${RouteName.Parameters}/${RouteName.ModeleSMS}`,
                            translate: 'MENU.MODELE_SMS',
                        },
                        {
                            moduleId: Modules.Parameters,
                            title: RouteName.Numeration,
                            page: `/${RouteName.Parameters}/${RouteName.Numeration}`,
                            translate: 'MENU.NUMERATION',
                        },
                        {
                            moduleId: Modules.Parameters,
                            title: RouteName.DocumentParameter,
                            page: `/${RouteName.Parameters}/${RouteName.DocumentParameter}`,
                            translate: 'MENU.DOCUMENT_PARAMETER',
                        },
                        {
                            moduleId: Modules.Parameters,
                            title: RouteName.PeriodComptable,
                            page: `/${RouteName.Parameters}/${RouteName.PeriodComptable}`,
                            translate: 'MENU.PERIODE_COMPTABLE',
                        },
                        {
                            moduleId: Modules.TypeLogement,
                            title: RouteName.TypeLogement,
                            page: `/${RouteName.Parameters}/${RouteName.TypeLogement}`,
                            translate: 'MENU.TYPE_LOGEMENT',
                        },
                        {
                            moduleId: Modules.TypeChauffage,
                            title: RouteName.TypeChauffage,
                            page: `/${RouteName.Parameters}/${RouteName.TypeChauffage}`,
                            translate: 'MENU.TYPES_CHAUFFAGE',
                        },
                        {
                            moduleId: Modules.Parameters,
                            title: RouteName.SourceDuLead,
                            page: `/${RouteName.Parameters}/${RouteName.SourceDuLead}`,
                            translate: 'MENU.SOURCE_DU_LEAD',
                        },
                    ]
                },
            ]
        },
    };

    static get configs(): IMenuConfig {
        return CopyHelper.copy(this.defaults);
    }
}
