import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, fromEvent, merge, Observable, of } from 'rxjs';
import { StudentDataModel, ResponseData } from './material-table-demo.model';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  tap,
} from 'rxjs/operators';

@Component({
  selector: 'app-material-table-demo',
  templateUrl: './material-table-demo.component.html',
  styleUrls: ['./material-table-demo.component.scss'],
})
export class MaterialTableDemoComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  @ViewChild('input') input: ElementRef | null = null;

  columnsToDisplay = ['name', 'age', 'department'];
  //Built-in DataSource
  //dataSource: MatTableDataSource<StudentDataModel>;

  //Custom DataSource
  dataSource: StudentDataSource;

  constructor(private httpClient: HttpClient) {
    ////Built-in DataSource
    //this.dataSource = new MatTableDataSource();

    //Paginator with built-in DataSource
    //this.dataSource.paginator = this.paginator;
    this.dataSource = new StudentDataSource(this.httpClient);
    /*
    //Built-in DataSource
    this.httpClient
      .get<ResponseData>('http://localhost:3000/static-data')
      .subscribe((data: ResponseData) => {
        console.log('Data : ' + JSON.stringify(data));
        console.log(data.length);
        this.dataSource.data = data.students;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
      */
  }

  ngOnInit(): void {
    this.loadStudentsData();
  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input?.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          if (null !== this.paginator) {
            this.paginator.pageIndex = 0;
            this.loadStudentsData();
          }
        })
      )
      .subscribe();

    // reset the paginator after sorting
    this.sort?.sortChange.subscribe(() => {
      if (this.paginator !== null) this.paginator.pageIndex = 0;
    });

    // on sort or paginate events, load a new page
    if (this.sort && this.paginator) {
      merge(this.sort.sortChange, this.paginator.page)
        .pipe(tap(() => this.loadStudentsData()))
        .subscribe();
    }
  }

  loadStudentsData() {
    this.dataSource.loadStudentsData(
      this.input?.nativeElement.value,
      this.sort?.direction,
      this.paginator?.pageIndex,
      this.paginator?.pageSize
    );
  }

  applyFilter(filterValue: string) {
    //Built-in DataSource
    //this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

//Server-side Pagination
export class StudentDataSource extends DataSource<StudentDataModel> {
  private studentsDataSubject = new BehaviorSubject<StudentDataModel[]>([]);
  private studentsDataTotalSubject = new BehaviorSubject<number>(0);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  public total$ = this.studentsDataTotalSubject.asObservable();

  constructor(private httpClient: HttpClient) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<StudentDataModel[]> {
    return this.studentsDataSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer) {
    console.log('In disconnect...');
    this.studentsDataSubject.complete();
    this.loadingSubject.complete();
    this.studentsDataTotalSubject.complete();
  }

  loadStudentsData(
    filter = '',
    sortDirection = 'asc',
    pageIndex = 0,
    pageSize = 5
  ) {
    console.log('pageIndex : ' + pageIndex);
    console.log('pageSize : ' + pageSize);
    this.loadingSubject.next(true);

    const emptyResponseData: ResponseData = {
      students: [],
      total: 0,
    };

    return this.httpClient
      .get<ResponseData>('http://localhost:3000/static-data')
      .pipe(
        catchError(() => of(emptyResponseData)),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((response: ResponseData) => {
        console.log('inner' + response.students);
        console.log('inner 111' + response.students.length);
        this.studentsDataSubject.next(response.students);
        this.studentsDataTotalSubject.next(response.total);
      });
  }

  filter() {}
}
