import { API_VERSIONS_VALUES } from "@/lib/api-versions";
import { TimezonesService } from "@/modules/timezones/services/timezones.service";
import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags as DocsTags } from "@nestjs/swagger";

import { SUCCESS_STATUS } from "@calcom/platform-constants";
import type { CityTimezones } from "@calcom/platform-libraries";
import { ApiResponse } from "@calcom/platform-types";

@Controller({
  path: "/timezones",
  version: API_VERSIONS_VALUES,
})
@DocsTags("Timezones")
export class TimezonesController {
  constructor(private readonly timezonesService: TimezonesService) {}

  @Get("/")
  @ApiOperation({ summary: "Get all timezones" })
  async getTimeZones(): Promise<ApiResponse<CityTimezones>> {
    const timeZones = await this.timezonesService.getCityTimeZones();

    return {
      status: SUCCESS_STATUS,
      data: timeZones,
    };
  }
}
