import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { RefreshToken } from "./RefreshToken"

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ unique: true })
    email!: string

    @Column({ name: 'password_hash' })
    password!: string

    @Column({ name: 'first_name', nullable: true })
    firstName!: string

    @Column({ name: 'last_name', nullable: true })
    lastName!: string

    @Column({ name: 'is_active', default: true })
    isActive!: boolean

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date

    @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
    refreshTokens!: RefreshToken[]
} 