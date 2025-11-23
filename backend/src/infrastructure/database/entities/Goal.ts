import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";

export enum GoalType {
  MUSCLE_MASS = "muscle_mass",
  WEIGHT = "weight",
  PERFORMANCE = "performance",
  BODY_FAT = "body_fat"
}

export enum GoalMetric {
  KILOGRAMS = "kg",
  POUNDS = "lbs",
  PERCENTAGE = "%",
  REPS = "reps",
  SECONDS = "seconds",
  MINUTES = "minutes"
}

@Entity("goals")
export class Goal {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", nullable: true })
  userId!: string;

  @Column("varchar")
  name!: string;

  @Column({
    type: "varchar",
    enum: GoalType
  })
  type!: GoalType;

  @Column({ type: "varchar", nullable: true })
  exerciseName?: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "float" })
  currentValue!: number;

  @Column({ type: "float" })
  goalValue!: number;

  @Column({ type: "float" })
  startValue!: number;

  @Column({
    type: "varchar",
    enum: GoalMetric
  })
  metric!: GoalMetric;

  @Column({ type: "date", nullable: true })
  targetDate?: string;

  @Column({ type: "varchar", default: "active" })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Removed foreign key constraint since we use Supabase auth.users
  // @ManyToOne("User", (user: any) => user.goals, { onDelete: "CASCADE" })
  // @JoinColumn({ name: "userId" })
  // user!: any;
}
