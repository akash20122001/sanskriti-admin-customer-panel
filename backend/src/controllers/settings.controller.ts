import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const settingsController = {
    // Get settings (create default if not exists)
    async getSettings(_req: Request, res: Response): Promise<any> {
        try {
            let settings = await prisma.settings.findFirst();
            if (!settings) {
                settings = await prisma.settings.create({
                    data: {} // Uses default values from schema
                });
            }
            res.json(settings);
        } catch (error) {
            console.error('Get settings error:', error);
            res.status(500).json({ error: 'Failed to fetch settings' });
        }
    },

    // Update settings
    async updateSettings(req: Request, res: Response): Promise<any> {
        try {
            const { companyPan, companyGst } = req.body;

            if (!companyPan || !companyGst) {
                return res.status(400).json({ error: 'Company PAN and GST are required' });
            }

            let settings = await prisma.settings.findFirst();

            if (settings) {
                settings = await prisma.settings.update({
                    where: { id: settings.id },
                    data: { companyPan, companyGst }
                });
            } else {
                settings = await prisma.settings.create({
                    data: { companyPan, companyGst }
                });
            }

            res.json(settings);
        } catch (error) {
            console.error('Update settings error:', error);
            res.status(500).json({ error: 'Failed to update settings' });
        }
    }
};
