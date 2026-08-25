import { Module } from '@nestjs/common';
import {
  RoutesController,
  FreightController,
  ForecastingController,
  OptimizationController,
  RiskController,
  ContractsController,
  RecommendationsController
} from './placeholder.controller';

@Module({
  controllers: [
    RoutesController,
    FreightController,
    ForecastingController,
    OptimizationController,
    RiskController,
    ContractsController,
    RecommendationsController
  ]
})
export class PlaceholderModule {}
