/**
 * a class describe JSON column prix par quantite
 */
export interface IPrixParQuantite {

    /** price in TTC */
    prix: number;

    /** the minimal quantity */
    quantiteMinimal: number;

    /** the maximum quantity */
    quantiteMaximal: number;

}
