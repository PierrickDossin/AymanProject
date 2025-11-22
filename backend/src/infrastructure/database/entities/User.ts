import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

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

  @OneToMany("Meal", (meal: any) => meal.user)
  meals!: any[];

  @OneToMany("Goal", (goal: any) => goal.user)
  goals!: any[];

  @OneToMany("Workout", (workout: any) => workout.user)
  workouts!: any[];
}
