// this.observable = this.restService.getList(id);

// const state$ = {
//     list: await this.observable.toPromise(),
// };

// if (state$.list) {
//     if (typeof state$.list.uploadDate === 'string') {
//     state$.list.uploadDate = new Date(state$.list.uploadDate);
//     }
// }

// this.router.navigate([`app/lists/${id}`], {
//     state: state$
// });