import { Controller, Get } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator.js';
import { SearchService } from './search.service.js';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @Get('')
  search() {
    return this.searchService.search();
  }

  @Public()
  @Get('suggestions')
  suggestions() {
    return this.searchService.suggestions();
  }

  @Public()
  @Get('facets')
  facets() {
    return this.searchService.facets();
  }

}
