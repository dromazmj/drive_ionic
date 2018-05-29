import { Exercise } from "./Exercise";

export class LiftingHistoryModel {
    id: number;
    date: any;
    weight: number;
    gains: number;
    reps: number;
    user_id: number;
    oneRepMax: number;
    exercise: Exercise;
  }