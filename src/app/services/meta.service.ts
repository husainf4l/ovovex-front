import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MetaService {
    constructor(
        private meta: Meta,
        private title: Title,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {}

    initMetaTags() {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                const childRoute = this.getChildRoute(this.activatedRoute);
                if (childRoute.snapshot.data) {
                    const { title, description } = childRoute.snapshot.data;
                    if (title) {
                        this.title.setTitle(title);
                    }
                    if (description) {
                        this.meta.updateTag({ name: 'description', content: description });
                    }
                }
            });
    }

    private getChildRoute(route: ActivatedRoute): ActivatedRoute {
        return route.firstChild ? this.getChildRoute(route.firstChild) : route;
    }
}
