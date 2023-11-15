#include <iostream>
#include <string>
#define STB_IMAGE_IMPLEMENTATION
#include "lib/stb/stb_image.h"
#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "lib/stb/stb_image_write.h"
#include <chrono>
#include <vector>
#include "test.cpp"
#define STB_IMAGE_RESIZE_IMPLEMENTATION
#include "lib/stb/stb_image_resize2.h"
#include "lib/json/json.hpp"
#include <fstream>
#include <filesystem>

typedef struct {
    string path;
    float cosine;
} ElType;


typedef struct {
    float h;
    float s;
    float v;
} HSV;

using namespace std;
using json = nlohmann::json;
namespace fs = std::filesystem;

float max(float a, float b) {
    if (a >= b) {
        return a;
    }
    else {
        return b;
    }
}

float min(float a, float b) {
    if (a < b) {
        return a;
    }
    else {
        return b;
    }
}


vector <vector <HSV>> convertImagetoHSV(const string& filename) {
    int width, height, channel;
    const char* c = filename.c_str();
    unsigned char* img = stbi_load(c, &width, &height, &channel, 3);
    auto *imgVector = new float[width * height * channel];
    copy(img, img + width * height * channel, imgVector);
    free(img);
    auto* hsv = new vector<vector<HSV>>(height, vector<HSV>(width));
    int i, j, k = 0;
    for (i = 0; i < height; i++) {
        for (j = 0; j < width; j++) {
            float r = static_cast<float>(imgVector[k]) / 255;
            float g = static_cast<float>(imgVector[k + 1]) / 255;
            float b = static_cast<float>(imgVector[k + 2]) / 255;
            float cmax = max(r, max(g, b));
            float cmin = min(r, min(g, b));
            float delta = cmax - cmin;
            float h;
            if (delta == 0) {
                h = 0;
            }
            else if (cmax == r) {
                float temp = ((g - b) / delta);
                int temp2 = (int)temp;
                h = 60 * ((float)(temp2 % 6) + (temp - (float)temp2));
            }
            else if (cmax == g) {
                h = 60 * (((b - r) / delta) + 2);
            }
            else {
                h = 60 * (((r - g) / delta) + 4);
            }

            float s, v;
            if (cmax == 0) {
                s = 0;
            }
            else {
                s = (delta / cmax);
            }

            v = cmax;

            (*hsv)[i][j].h = h;
            (*hsv)[i][j].s = s;
            (*hsv)[i][j].v = v;
            k += 3;
        }
    }
    free(imgVector);
    return *hsv;

}

float cos(vector <float> A, vector <float> B) {
    int i;
    float sum = 0;
    float lenA = 0.0, lenB = 0.0;
    for (i = 0; i < A.size(); i++) {
        sum += A[i] * B[i];
        lenA += A[i] * A[i];
        lenB += B[i] * B[i];
    }
    if (sqrt(lenA) * sqrt(lenB) == 0) {
        return 0;
    }
    else {
        return sum / (sqrt(lenA) * sqrt(lenB));
    }
}

void computeHistogram(HSV &block, vector<float> *histogram, int bins) {
    (*histogram)[(int)(block.h / (360.0 / bins))]++;
    (*histogram)[(int)(block.s * 100 / (100.0 / bins))]++;
    (*histogram)[(int)(block.v * 100 / (100.0 / bins))]++;
}

void displayMatrix(vector <vector <HSV>> mat) {
    int i, j;
    for (i = 0; i < mat.size(); i++) {
        for (j = 0; j < mat[0].size(); j++) {
            cout << "[";
            cout << mat[i][j].h << ", ";
            cout << mat[i][j].s << ", ";
            cout << mat[i][j].v << "";

            cout << "], ";
        }
        cout << endl;
    }
}


float cosBlock(vector<vector<HSV>> &mat1, vector<vector<HSV>> &mat2, int bins, int size) {
    float sum = 0.0;
    int step = 0;

    auto* histogram1 = new vector<float> (bins * 3, 0);
    auto* histogram2 = new vector <float> (bins * 3, 0);
    for (int i = 0; i < mat1.size(); i += size) {
        for (int j = 0; j < mat1[0].size(); j += size) {
            fill((*histogram1).begin(), (*histogram1).end(), 0);
            fill((*histogram2).begin(), (*histogram2).end(), 0);

            for (int k = i; k < i + size; k++) {
                for (int l = j; l < j + size; l++) {
                    if (k < mat1.size() && l < mat1[0].size()) {
                        computeHistogram(mat1[k][l], (histogram1), bins);
                        computeHistogram(mat2[k][l], (histogram2), bins);
                    }
                }
            }
            step++;
            float per = cos(*histogram1, *histogram2);
            sum += per;
            if (i + size > mat1.size() && j + size > mat1[0].size()) {
                break;
            }
        }
    }
    float sim = sum / (float)step;
    return sim * 100; // Bentuk persen
}


int checkCos(float cos) {
    if (cos > 60) {
        return 1;
    }
    else {
        return 0;
    }
}


void queryAllImage(const string& pathImage, const string& path, vector <ElType> *hasil) {
    auto *mat1 = new vector <vector <HSV>>;
    *mat1 = convertImagetoHSV(pathImage);
    int step = 0;
    for (const auto& entry : fs::directory_iterator(path)) {
        auto *matQuery = new vector<vector<HSV>>;
        *matQuery = convertImagetoHSV(path + entry.path().filename().string());
        float cos = cosBlock(*mat1, *matQuery, 10, 10);
        if (checkCos(cos)) {
            ElType temp;
            temp.path = entry.path().filename().string();
            temp.cosine = cos;
            (*hasil).push_back(temp);
        }
        step++;
        if (step == 500) {
            break;
        }
        free(matQuery);
    }
    free(mat1);
}

int binarySearch(const std::vector<ElType>& a, float item,
                 int low, int high) {
    if (high <= low)
        return (item < a[low].cosine) ?
               (low + 1) : low;

    int mid = (low + high) / 2;

    if (item == a[mid].cosine)
        return mid + 1;

    if (item < a[mid].cosine)
        return binarySearch(a, item, mid + 1, high);
    return binarySearch(a, item, low, mid - 1);
}

// Function to sort a vector of ElType
void sortResult(std::vector<ElType>& a) {
    int i, j, loc;
    float selected;
    for (i = 1; i < a.size(); ++i) {
        j = i - 1;
        selected = a[i].cosine;
        std::string selectedPath = a[i].path;

        loc = binarySearch(a, selected, 0, j);

        while (j >= loc) {
            a[j + 1].cosine = a[j].cosine;
            a[j + 1].path = a[j].path;
            j--;
        }
        a[j + 1].cosine = selected;
        a[j + 1].path = selectedPath;
    }
}


int main() {
    string path, path2;
    cout << "Masukkan image yang akan dicek:";
    cin >> path;
    path = "uploads/" + path;
    auto start = chrono::high_resolution_clock::now();
    path2 = "uploads/dataset/";
    auto *hasil = new vector <ElType>;
    queryAllImage(path, path2, hasil);
    sortResult(*hasil);
//    for (int i = 0; i < (*hasil).path.size(); i++) {
//        cout << (*hasil).path[i] << ": " << (*hasil).cosine[i] << endl;
//    }
    json jsonOutput;
    for (const auto& el : *hasil) {
        jsonOutput.push_back({
                                     {"path", el.path},
                                     {"cosine", el.cosine}
                             });
    }
    string filename = "output.json";
    ofstream outputFile(filename);
    if (!outputFile.is_open()) {
        cout << "Error opening file" << endl;
        return 0;
    }
    else {
        outputFile << jsonOutput.dump(4) << endl;
    }
    auto stop = chrono::high_resolution_clock::now();
    cout << "Waktu eksekusi: " << chrono::duration_cast<chrono::milliseconds>(stop - start).count() << " ms" << endl;
    cout << "Hasil: ";
    return 0;
}