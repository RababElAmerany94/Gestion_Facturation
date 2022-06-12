export interface Tourne {
    lundi: Day;
    mardi: Day;
    mercredi: Day;
    jeudi: Day;
    vendredi: Day;
    samedi: Day;
    dimanche: Day;
}

export interface Day {
    matin: boolean;
    apresMidi: boolean;
}
