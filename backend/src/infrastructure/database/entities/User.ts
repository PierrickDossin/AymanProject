import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Meal } from "./Meal.js";
import { Goal } from "./Goal.js";
import { Workout } from "./Workout.js";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar", { unique: true })
  username!: string;

  @Column("varchar")
  firstName!: string;

  @Column("varchar")
  lastName!: string;

  @Column("varchar", { unique: true })
  email!: string;

  @Column("varchar")
  password!: string;

  @Column("varchar", { nullable: true })
  avatarUrl?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Meal, (meal: Meal) => meal.user)
  meals!: Meal[];

  @OneToMany(() => Goal, (goal: Goal) => goal.user)
  goals!: Goal[];

  @OneToMany(() => Workout, (workout: Workout) => workout.user)
  workouts!: Workout[];
}
