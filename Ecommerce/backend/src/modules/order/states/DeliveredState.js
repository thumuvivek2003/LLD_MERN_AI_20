import { IOrderState } from './IOrderState.js';

// Terminal: all transitions remain illegal via base class defaults.
export class DeliveredState extends IOrderState {}
