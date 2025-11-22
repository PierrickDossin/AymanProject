import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";

export interface PlannedExercise {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: string; // Can be "8-10" or "12" or "AMRAP"
  duration: number; // in minutes per exercise
  notes?: string;
}

@Entity("workouts")
export class Workout {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar")
  userId!: string;

  @Column("varchar")
  name!: string;

  @Column({ type: "date" })
  scheduledDate!: string; // YYYY-MM-DD format

  @Column({ type: "simple-json" })
  exercises!: PlannedExercise[];

  @Column({ type: "int" })
  totalDuration!: number; // Total estimated duration in minutes

  @Column({ type: "varchar", default: "planned" })
  status!: string; // planned, completed, skipped

  @Column({ type: "datetime", nullable: true })
  completedAt!: Date | null;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne("User", (user: any) => user.workouts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: any;
}
