import {from, Observable, of, toArray} from "rxjs";
import {fromFetch} from "rxjs/fetch";
import {catchError, concatMap, map, switchMap} from "rxjs/operators";

export class PokeService {
    private API_URL = `https://pokeapi.co/api/v2/pokemon?limit=151`;

    public getPokemon$(): Observable<any> {
        return fromFetch(this.API_URL).pipe(
            switchMap((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return of({error: true, message: `Error ${response.status}`})
                }
            }),
            map((res: any) => res.results),
            switchMap(results => { // split the array into a stream
                return from(results);
            }),
            concatMap((poke: any) => {
                return fromFetch(poke.url).pipe(
                    switchMap((response) => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            return of({error: true, message: `Error ${response.status}`})
                        }
                    }),
                )
            }),
            toArray(),
            catchError((err) => of({error: true, message: err.message})));
    }
}