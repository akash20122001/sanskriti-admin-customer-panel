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
                    data: {
                        sellingPlatforms: ['Amazon', 'Flipkart', 'Meesho', 'Etsy'],
                        deliveryPartners: ['Delhivery', 'Blue Dart', 'DTDC', 'India Post']
                    } // Default values
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
            const { companyPan, companyGst, sellingPlatforms, deliveryPartners } = req.body;

            // Build update data object
            const updateData: any = {};
            if (companyPan !== undefined) updateData.companyPan = companyPan;
            if (companyGst !== undefined) updateData.companyGst = companyGst;
            if (sellingPlatforms !== undefined) updateData.sellingPlatforms = sellingPlatforms;
            if (deliveryPartners !== undefined) updateData.deliveryPartners = deliveryPartners;

            let settings = await prisma.settings.findFirst();

            if (settings) {
                settings = await prisma.settings.update({
                    where: { id: settings.id },
                    data: updateData
                });
            } else {
                settings = await prisma.settings.create({
                    data: {
                        ...updateData,
                        sellingPlatforms: sellingPlatforms || ['Amazon', 'Flipkart', 'Meesho', 'Etsy'],
                        deliveryPartners: deliveryPartners || ['Delhivery', 'Blue Dart', 'DTDC', 'India Post']
                    }
                });
            }

            res.json(settings);
        } catch (error) {
            console.error('Update settings error:', error);
            res.status(500).json({ error: 'Failed to update settings' });
        }
    }
};
