import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Appointment {
    _id: string;
    patient_id: string;
    doctor_id: string;
    schedule_time: Date;
    status: 'pending' | 'confirmed' | 'completed' | 'canceled';
    appointmentType: 'in_person' | 'telemedicine';
    queueNumber: number;
    description: string;
    createdAt: string;
    updatedAt: string;
  }
  