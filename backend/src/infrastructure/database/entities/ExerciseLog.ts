import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { User } from "./User.js";

@Entity()
export class ExerciseLog {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  exerciseName!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  weight!: number;

  @Column("int")
  reps!: number;

  @Column("int")
  sets!: number;

  @Column({ nullable: true })
  notes?: string;

  @Column()
  workoutType!: string; // "Push Day", "Pull Day", "Leg Day"

  @CreateDateColumn({ type: "timestamp" })
  performedAt!: Date;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column()
  userId!: string;
}
