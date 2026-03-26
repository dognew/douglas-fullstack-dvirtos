<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class BootController extends Controller
{
    /**
     * Retrieve system hardware specifications.
     *
     * @return JsonResponse
     */
    public function getSpecs(): JsonResponse
    {
        // 1. Initialize Fallback Data Model
        $fallback = [
            'bios_name' => 'MEGABIOS(C) 2026',
            'vendor' => 'DogNew Informática, MEI',
            'cpu' => 'Intel(R) Xeon(R) CPU E5-2666 v3 @ 2.90GHz [BK]',
            'speed' => '2900MHz [BK]',
            'ram' => '31.24 GB [BK]',
            'storage' => 'NVME: Samsung 980 Pro 1TB [BK]',
            'motherboard' => 'Dell Inc. 0WCJNT (PowerEdge R730) [BK]'
        ];

        try {
            // 2. Capture Real-time CPU and RAM Information from /proc
            $cpuInfo = @file_get_contents('/proc/cpuinfo');
            if ($cpuInfo && preg_match('/model name\s+:\s+(.*)$/m', $cpuInfo, $matches)) {
                $cpuModel = trim($matches[1]);
                $fallback['cpu'] = $cpuModel;

                // BUG FIX: Dynamic clock speed calculation based on CPU model string
                if (preg_match('/(\d+\.\d+)GHz/', $cpuModel, $speedMatches)) {
                    $ghz = (float)$speedMatches[1];
                    $mhz = $ghz * 1000;
                    $fallback['speed'] = $mhz . "MHz";
                }
            }

            $memInfo = @file_get_contents('/proc/meminfo');
            if ($memInfo && preg_match('/MemTotal:\s+(\d+) kB/', $memInfo, $matches)) {
                $total_gb = round($matches[1] / 1024 / 1024, 2);
                $fallback['ram'] = $total_gb . " GB";
            }

            // 3. Professional Motherboard Detection Logic via DMI
            $boardPath = '/sys/class/dmi/id/board_name';
            $vendorPath = '/sys/class/dmi/id/board_vendor';

            $boardName = file_exists($boardPath) ? trim(@file_get_contents($boardPath)) : '';
            $vendor = file_exists($vendorPath) ? trim(@file_get_contents($vendorPath)) : '';

            // If DMI data is inaccessible (permission denied) or generic, apply coherent fallback
            if (empty($boardName) || stripos($boardName, 'Acesso Negado') !== false || stripos($boardName, 'Standard') !== false) {
                if (stripos($fallback['cpu'], 'Xeon') !== false) {
                    $fallback['motherboard'] = 'Dell Inc. 0WCJNT (PowerEdge R730)';
                } elseif (stripos($fallback['cpu'], 'AMD') !== false) {
                    $fallback['motherboard'] = 'Supermicro H11DSi (AMD EPYC Node)';
                } else {
                    $fallback['motherboard'] = 'ASUSTeK COMPUTER INC. PRIME Z270-A';
                }
            } else {
                if (empty($vendor) || stripos($vendor, 'DEFAULT') !== false) {
                    $fallback['motherboard'] = "INTEL X99 CHIPSET SERIES"; 
                } else {
                    $fallback['motherboard'] = "$vendor $boardName";
                }
            }

            // 4. Storage Device Detection (Sanitizing QEMU or Virtual identifiers)
            $disks = glob('/sys/block/sd*') ?: glob('/sys/block/nvme*');
            if (!empty($disks)) {
                $diskModel = trim(@file_get_contents($disks[0] . "/device/model"));

                // Only replace if identifier is not generic or virtualized
                if (!empty($diskModel) && stripos($diskModel, 'QEMU') === false && stripos($diskModel, 'Virtual') === false) {
                    $fallback['storage'] = $diskModel;
                }
            }

        } catch (\Exception $e) {
            // On exception, initial fallback array remains intact
        }

        return response()->json($fallback);
    }
}