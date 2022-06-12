// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { RouteName } from './core/enums/route-name.enum';
import { AuthGuard } from './core/guards/auth-guard.service';
import { BaseComponent } from './modules/base/base.component';


const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('../app/pages/auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: '',
        component: BaseComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: RouteName.Dashboard,
                loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
            },
            {
                path: RouteName.Clients,
                loadChildren: () => import('./pages/clients/clients.module').then(m => m.ClientsModule),
            },
            {
                path: RouteName.Utilisateurs,
                loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule),
            },
            {
                path: RouteName.Agence,
                loadChildren: () => import('./pages/agences/agences.module').then(m => m.AgencesModule),
            },
            {
                path: RouteName.Suppliers,
                loadChildren: () => import('./pages/suppliers/suppliers.module').then(m => m.SuppliersModule),
            },
            {
                path: RouteName.Produits,
                loadChildren: () => import('./pages/produits/produits.module').then(m => m.ProduitsModule),
            },
            {
                path: RouteName.Dossier,
                loadChildren: () => import('./pages/dossier/dossier.module').then(m => m.DossierModule),
            },
            {
                path: RouteName.Parameters,
                loadChildren: () => import('./pages/parametres/parametres.module').then(m => m.ParametresModule),
            },
            {
                path: RouteName.Devis,
                loadChildren: () => import('./pages/devis/devis.module').then(m => m.DevisModule),
            },
            {
                path: RouteName.Avoir,
                loadChildren: () => import('./pages/avoir/avoir.module').then(m => m.AvoirModule),
            },
            {
                path: RouteName.Facture,
                loadChildren: () => import('./pages/facture/facture.module').then(m => m.FactureModule),
            },
            {
                path: RouteName.Paiement,
                loadChildren: () => import('./pages/paiement/paiement.module').then(m => m.PaiementModule),
            },
            {
                path: RouteName.Comptabilite,
                loadChildren: () => import('./pages/accounting/accounting.module').then(m => m.AccountingModule),
            },
            {
                path: RouteName.AgendaCommercial,
                loadChildren: () => import('./pages/agenda-commercial/agenda-commercial.module').then(m => m.AgendaCommercialModule),
            },
            {
                path: RouteName.BonCommande,
                loadChildren: () => import('./pages/bon-commande/bon-commande.module').then(m => m.BonCommandeModule),
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
        ],
    },

    { path: '**', redirectTo: 'error/403', pathMatch: 'full' },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
